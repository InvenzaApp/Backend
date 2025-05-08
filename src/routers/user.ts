import { Router } from "express";
import UserModule from "../modules/user-module";
import {INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";
import {authMiddleware} from "../authorization/api_authorization";
import OrganizationModule from "../modules/organization-module";
import { GroupModule } from "../modules/group-module";
import { SettingsModule } from "../modules/settings-module";
require("dotenv").config();

const router = Router();
const tokenManager = new TokenManager();
const groupModule = new GroupModule();
const userModule = new UserModule();
const organizationModule = new OrganizationModule();
const settingsModule = new SettingsModule();

router.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    const locale = req.get('locale');

    if(!email || !password) {
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return
    }

    const userData = userModule.signIn(email, password);

    if(!userData) {
        performFailureResponse(res, INVALID_CREDENTIALS);
        return;
    }

    const token = tokenManager.getAccessToken(userData.id);
    settingsModule.changeLanguage(userData.id, locale);

    performSuccessResponse(res, userData.toJson(), token);
});

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const usersList = userModule.getUsers();

    performSuccessResponse(res, usersList, token);
});

router.get('/:id', authMiddleware, (req, res) => {
   const resourceId = Number(req.params.id);
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);

   const user = userModule.getUserById(resourceId).toJson() as any;
   const groups = groupModule.getGroups(resourceId);

   user.groups = groups;

   performSuccessResponse(res, user, token);
});

router.post('/', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);

   const { name, lastname, email, password, groupsIdList, permissions } = req.body;

   if(!name || !lastname || !email || !password) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
   }

   const organization = organizationModule.getOrganizationByUserId(userId);

   const data = userModule.createUser(organization.id, name, lastname, email, password, groupsIdList, permissions);
   
   if(typeof data === "string"){
       performFailureResponse(res, data);
    }else{
        organizationModule.addUser(organization.id, data);
        groupModule.addUserToGroups(data.id, groupsIdList);
       performSuccessResponse(res, data.id, token);
   }
});

router.post('/update-password', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if(!oldPassword || !newPassword || !confirmNewPassword){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success = userModule.updatePassword(userId, oldPassword, newPassword, confirmNewPassword);

    performSuccessResponse(res, success, token);

});

router.put('/:id', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);
   const resourceId = Number(req.params.id);
   const { name, lastname, email, groupsIdList, permissions } = req.body;

   if(!name || !lastname || !email) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
   }

   userModule.updateUser(resourceId, name, lastname, email, groupsIdList, permissions);
   groupModule.updateUserGroups(resourceId, groupsIdList ?? []);
   performSuccessResponse(res, resourceId, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);

   const resourceId = Number(req.params.id);

   const organization = organizationModule.getOrganizationByUserId(resourceId);

   settingsModule.removeLanguage(resourceId);
   userModule.deleteUser(resourceId);
   groupModule.deleteUserFromGroups(resourceId);
   organizationModule.deleteUser(organization.id, resourceId);

   performSuccessResponse(res, resourceId, token);
});

export default router;