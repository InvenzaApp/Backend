import {Router} from "express";
import {GroupModule} from "../modules/group-module";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {authMiddleware} from "../authorization/api_authorization";
import {TokenManager} from "../managers/token-manager";
import {TaskModule} from "../modules/task-module";
import UserModule from "../modules/user-module";
import { NotificationsManager } from "../managers/notifications-manager";
import { LocaleManager } from "../managers/locale-manager";
require("dotenv").config();

const router = Router();
const groupModule = new GroupModule();
const tokenManager = new TokenManager()
const taskModule = new TaskModule();
const userModule = new UserModule();
const notifications = new NotificationsManager();
const localeManager = new LocaleManager();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const groupsList = groupModule.getGroups(userId);

    performSuccessResponse(res, groupsList, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    const group = groupModule.getGroup(groupId);

    performSuccessResponse(res, group, token);
});

router.post('/', authMiddleware, (req, res) => {
   const { name, usersIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

   if(!name || !usersIdList){
       performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
       return;
   }

   const groupId = groupModule.addGroup(name, usersIdList);

   notifications.sendNotificationToUsers(usersIdList, "group_created");

   performSuccessResponse(res, groupId, token);
});

router.put('/:id', authMiddleware, (req, res) => {
    const { name, usersIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!name || !usersIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const groupId = Number(req.params.id);

    const deletedUsers = groupModule.getRemovedUsersIdListOnUpdate(usersIdList, groupId);
    const addedUsers = groupModule.getAddedUsersIdListOnUpdate(usersIdList, groupId);
    notifications.sendNotificationToUsers(deletedUsers, "group_removed");
    notifications.sendNotificationToUsers(addedUsers, "group_added");

    groupModule.updateGroup(groupId, name, usersIdList);
    userModule.updateUserGroups(usersIdList, groupId);

    const notifyUsersIdList = usersIdList.filter((userId: number) => !addedUsers.includes(userId));

    notifications.sendNotificationToUsers(notifyUsersIdList, "group_updated");

    performSuccessResponse(res, groupId, token);
})

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    notifications.sendNotificationToGroup(groupId, "group_deleted");

    groupModule.deleteGroup(groupId);
    taskModule.removeGroupFromTasks(groupId);

    performSuccessResponse(res, groupId, token);
})

export default router;