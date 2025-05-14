import { Router } from "express";
import { GroupModule } from "../modules/group-module";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import { authMiddleware } from "../authorization/api_authorization";
import { TokenManager } from "../managers/token-manager";
import { TaskModule } from "../modules/task-module";
import UserModule from "../modules/user-module";
import { NotificationsManager } from "../managers/notifications-manager";
import { Group } from "../models/group";

require("dotenv").config();

const router = Router();
const groupModule = new GroupModule();
const tokenManager = new TokenManager()
const taskModule = new TaskModule();
const userModule = new UserModule();
const notifications = new NotificationsManager();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const groupsList: Group[] = groupModule.getGroups(userId);

    performSuccessResponse(res, groupsList, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    const group: Group | null = groupModule.getGroup(groupId);

    if(!group){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }else{
        performSuccessResponse(res, group, token);
    }
});

router.post('/', authMiddleware, (req, res) => {
    const { name, usersIdList, locked } = req.body;
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    if(!name || !usersIdList){
       performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
       return;
    }

    const group: Group | null = groupModule.addGroup(name, usersIdList, locked ?? false);

    if(!group){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    notifications.sendNotificationToUsers(usersIdList, "group_created");

    performSuccessResponse(res, group.id, token);
});

router.put('/:id', authMiddleware, (req, res) => {
    const { name, usersIdList, locked } = req.body;
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    if(!name || !usersIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const groupId = Number(req.params.id);

    const deletedUsers: number[] = groupModule.getRemovedUsersIdListOnUpdate(usersIdList, groupId);
    const addedUsers: number[] = groupModule.getAddedUsersIdListOnUpdate(usersIdList, groupId);

    notifications.sendNotificationToUsers(deletedUsers, "group_removed");
    notifications.sendNotificationToUsers(addedUsers, "group_added");

    const groupSuccess = groupModule.updateGroup(groupId, name, usersIdList, locked);

    if(!groupSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const userSuccess = userModule.updateUserGroups(usersIdList, groupId);

    if(!userSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const notifyUsersIdList: number[] = usersIdList.filter((userId: number) => !addedUsers.includes(userId));

    notifications.sendNotificationToUsers(notifyUsersIdList, "group_updated");

    performSuccessResponse(res, groupId, token);
})

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    notifications.sendNotificationToGroup(groupId, "group_deleted");

    const groupSuccess = groupModule.deleteGroup(groupId);

    if(!groupSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const taskSuccess = taskModule.removeGroupFromTasks(groupId);
    
    if(!taskSuccess){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    performSuccessResponse(res, groupId, token);
})

export default router;