import {Router} from "express";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {TaskModule} from "../modules/task-module";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {authMiddleware} from "../authorization/api_authorization";
import {TokenManager} from "../managers/token-manager";
import UserModule from "../modules/user-module";
import OrganizationModule from "../modules/organization-module";
import { NotificationsManager } from "../managers/notifications-manager";

require("dotenv").config();

const router = Router();
const taskModule = new TaskModule();
const tokenManager = new TokenManager();
const userModule = new UserModule();
const notifications = new NotificationsManager();

router.post('/', authMiddleware, (req, res) => {
    const { title, description, deadline, groupsIdList, locked, commentsEnabled } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList || commentsEnabled == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const user = userModule.getUserById(userId);

    const taskId = taskModule.addTask(title, description, deadline, groupsIdList, user, locked ?? false, commentsEnabled);

    notifications.sendNotificationToGroups(groupsIdList, "task_created");

    performSuccessResponse(res, taskId, token);
});

router.put('/:id', authMiddleware, (req, res) => {
    const id = Number(req.params.id);
    const { title, description, deadline, groupsIdList, status, locked, commentsEnabled } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList || commentsEnabled == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const deletedGroups = taskModule.getDeletedGroupsIdListOnUpdate(groupsIdList, id);
    const addedGroups = taskModule.getAddedGroupsIdListOnUpdate(groupsIdList, id);
    notifications.sendNotificationToGroups(deletedGroups, "task_removed");
    notifications.sendNotificationToGroups(addedGroups, "task_added");

    const taskId = taskModule.updateTask(id, title, description, deadline, groupsIdList, status, locked, commentsEnabled);

    const notifyGroupsIdList = groupsIdList.filter((groupId: number) => !addedGroups.includes(groupId));

    notifications.sendNotificationToGroups(notifyGroupsIdList, "task_updated");

    performSuccessResponse(res, taskId, token);
});

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const tasks = taskModule.getTasks(userId);

    performSuccessResponse(res, tasks, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const resourceId = Number(req.params.id);
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const task = taskModule.getTask(resourceId);

    performSuccessResponse(res, task, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
    const resourceId = Number(req.params.id);
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const task = taskModule.getTask(resourceId);
    notifications.sendNotificationToGroups(task.groupsIdList, "task_deleted");
    taskModule.deleteTask(resourceId);

    performSuccessResponse(res, resourceId, token);
});

export default router;