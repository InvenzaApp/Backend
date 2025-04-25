import {Router} from "express";
import {GroupModule} from "../modules/group-module";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {authMiddleware} from "../authorization/api_authorization";
import {TokenManager} from "../managers/token-manager";
import {TaskModule} from "../modules/task-module";
import {delay} from "../helpers/delay";
import UserModule from "../modules/user-module";
require("dotenv").config();

const router = Router();
const groupModule = new GroupModule();
const tokenManager = new TokenManager()
const taskModule = new TaskModule();
const userModule = new UserModule();
const isDebug = process.env.DEBUG;
const delayTime = (process.env.DELAY || 300) as number;

router.get('/', authMiddleware, async (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const groupsList = groupModule.getGroups(userId);

    if(isDebug){
        await delay(delayTime);
    }

    performSuccessResponse(res, groupsList, token);
});

router.get('/:id', authMiddleware, async (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    const group = groupModule.getGroup(groupId);

    if(isDebug){
        await delay(delayTime);
    }

    performSuccessResponse(res, group, token);
});

router.post('/', authMiddleware, async (req, res) => {
   const { name, usersIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

   if(!name || !usersIdList){
       performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
       return;
   }

   const groupId = groupModule.addGroup(name, usersIdList);

    if(isDebug){
        await delay(delayTime);
    }

   performSuccessResponse(res, groupId, token);
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { name, usersIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!name || !usersIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const groupId = Number(req.params.id);

    groupModule.updateGroup(groupId, name, usersIdList);
    userModule.updateUserGroups(usersIdList, groupId);

    if(isDebug){
        await delay(delayTime);
    }

    performSuccessResponse(res, groupId, token);
})

router.delete('/:id', authMiddleware, async (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    groupModule.deleteGroup(groupId);
    taskModule.removeGroupFromTasks(groupId);

    if(isDebug){
        await delay(delayTime);
    }

    performSuccessResponse(res, groupId, token);
})

export default router;