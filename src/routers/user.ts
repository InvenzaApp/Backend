import { Router } from "express";
import UserModule from "../modules/user-module";
import { INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS, USER_EXISTS } from "../helpers/response-codes";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import { TokenManager } from "../managers/token-manager";
import { authMiddleware } from "../authorization/api_authorization";
import OrganizationModule from "../modules/organization-module";
import { GroupModule } from "../modules/group-module";
import { SettingsModule } from "../modules/settings-module";
import { User } from "../models/user";
import { Group } from "../models/group";
import { Organization } from "../models/organization";
require("dotenv").config();

const router = Router();
const tokenManager = new TokenManager();
const groupModule = new GroupModule();
const userModule = new UserModule();
const organizationModule = new OrganizationModule();
const settingsModule = new SettingsModule();

router.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    const locale: string | undefined = req.get('locale');

    if(!email || !password) {
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return
    }

    const user = userModule.signIn(email, password);

    if(!user) {
        performFailureResponse(res, INVALID_CREDENTIALS);
        return;
    }

    const groupsList: Group[] = user.groupsIdList.flatMap((item) => {
        const group: Group | null = groupModule.getGroup(item);
    
        if(!group) return [];
        
        return group;
    })
    
    user.groups = groupsList;

    const token: string = tokenManager.getAccessToken(user.id);
    const success = settingsModule.changeLanguage(user.id, locale);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, user.toJson(), token);
    }
});

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const usersList: User[] = userModule.getUsers();

    performSuccessResponse(res, usersList, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const resourceId = Number(req.params.id);
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const user: User | null = userModule.getUserById(resourceId);
    const groups: Group[] = groupModule.getGroups(resourceId);

    if(!user){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    user.groups = groups;

    performSuccessResponse(res, user, token);
});

router.post('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { name, lastname, email, password, groupsIdList, permissions, admin, locked } = req.body;

    if(!name || !lastname || !email || !password) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
    }

    const organization: Organization | null = organizationModule.getOrganizationByUserId(userId);

    if(!organization){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const data: User | string = userModule.createUser(
        organization.id, 
        name, 
        lastname, 
        email, 
        password, 
        groupsIdList, 
        permissions, 
        admin ?? false, 
        locked ?? false
    );
   
    if(typeof data === "string"){
       performFailureResponse(res, data);
    }else{
        const organizationSuccess: boolean = organizationModule.addUser(organization.id, data);

        if(!organizationSuccess){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const groupSuccess: boolean = groupModule.addUserToGroups(data.id, groupsIdList);

        if(!groupSuccess){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        performSuccessResponse(res, data.id, token);
    }
});

router.post('/update-password', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success = userModule.updatePassword(userId, oldPassword, newPassword);

    performSuccessResponse(res, success, token);

});

router.put('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const resourceId = Number(req.params.id);
    const { name, lastname, email, groupsIdList, permissions, admin, locked } = req.body;

    if(!name || !lastname || !email) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
    }

    const userSuccess: boolean = userModule.updateUser(
        resourceId, 
        name, 
        lastname, 
        email, 
        groupsIdList, 
        permissions, 
        admin, 
        locked
    );

    if(!userSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const groupSuccess: boolean = groupModule.updateUserGroups(resourceId, groupsIdList ?? []);

    if(!groupSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    performSuccessResponse(res, resourceId, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const resourceId = Number(req.params.id);

    const organization: Organization | null = organizationModule.getOrganizationByUserId(resourceId);

    if(!organization){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const settingsSuccess: boolean = settingsModule.removeLanguage(resourceId);
    const userSuccess: boolean = userModule.deleteUser(resourceId);
    const groupSuccess: boolean = groupModule.deleteUserFromGroups(resourceId);
    const organizationSuccess: boolean = organizationModule.deleteUser(organization.id, resourceId);

    if(!settingsSuccess || !userSuccess || !groupSuccess || !organizationSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    performSuccessResponse(res, resourceId, token);
});

router.post('/update-user', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { name, lastname, email } = req.body;

    if(!name || !lastname || !email){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success: boolean = userModule.updateSelfAccount(userId, name, lastname, email);

    if(success){
        performSuccessResponse(res, success, token);
    }else{
        performFailureResponse(res, USER_EXISTS);
    }
});

router.get('/get-user/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const resourceId = Number(req.params.id);

    const user: User | null = userModule.getUserById(resourceId);

    if(!user){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, user, token);
    }
});

export default router;