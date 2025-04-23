import { Router } from "express";
import UserModule from "../modules/user-module";
import {INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";
import {delay} from "../helpers/delay";
import {authMiddleware} from "../authorization/api_authorization";
import OrganizationModule from "../modules/organization-module";
require("dotenv").config();

const router = Router();
const tokenManager = new TokenManager();
const userModule = new UserModule();
const isDebug = process.env.DEBUG;
const delayTime = (process.env.DELAY || 300) as number;
const organizationModule = new OrganizationModule();

router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return
    }

    const userData = userModule.signIn(email, password);

    if(!userData) {
        if(isDebug){
            await delay(delayTime);
        }

        performFailureResponse(res, INVALID_CREDENTIALS);
        return;
    }

    const token = tokenManager.getAccessToken(userData.id);

    if(isDebug){
        await delay(delayTime);
    }
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

   const user = userModule.getUserById(resourceId);

   performSuccessResponse(res, user, token);
});

router.post('/', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);

   const { name, lastname, email, password, groupsIdList } = req.body;

   if(!name || !lastname || !email || !password) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
   }

   const organization = organizationModule.getOrganizationByUserId(userId);

   const data = userModule.createUser(organization.id, name, lastname, email, password, groupsIdList);


   if(typeof data === "string"){
       performFailureResponse(res, data);
   }else{
       organizationModule.addUser(organization.id, data);
       performSuccessResponse(res, data.id, token);
   }
});

router.put('/:id', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);
   const resourceId = Number(req.params.id);
   const { name, lastname, email, groupsIdList } = req.body;

   if(!name || !lastname || !email) {
       performFailureResponse(res, INVALID_CREDENTIALS);
       return;
   }

   userModule.updateUser(resourceId, name, lastname, email, groupsIdList);
   performSuccessResponse(res, resourceId, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
   const { userId } = (req as any).user;
   const token = tokenManager.getAccessToken(userId);

   const resourceId = Number(req.params.id);

   const organization = organizationModule.getOrganizationByUserId(resourceId);

   userModule.deleteUser(resourceId);
   organizationModule.deleteUser(organization.id, resourceId);

   performSuccessResponse(res, resourceId, token);
});

export default router;