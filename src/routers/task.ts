import { Router } from "express";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { TaskModule } from "../modules/task-module";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import { authMiddleware } from "../authorization/api_authorization";
import { TokenManager } from "../managers/token-manager";
import UserModule from "../modules/user-module";
import { NotificationsManager } from "../managers/notifications-manager";
import { User } from "../models/user";
import { Task } from "../models/task";

require("dotenv").config();

const router = Router();
const taskModule = new TaskModule();
const tokenManager = new TokenManager();
const userModule = new UserModule();
const notifications = new NotificationsManager();

router.post('/', authMiddleware, (req, res) => {
    const { title, description, deadline, groupsIdList, locked, commentsEnabled } = req.body;
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const user: User | null = userModule.getUserById(userId);

    if(!user){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const task = taskModule.addTask(
        title, 
        description, 
        deadline, 
        groupsIdList, 
        user, 
        locked ?? false, 
        commentsEnabled ?? true,
    );

    if(!task){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    notifications.sendNotificationToGroups(groupsIdList, "task_created");

    performSuccessResponse(res, task.id, token);
});

router.put('/:id', authMiddleware, (req, res) => {
    const id = Number(req.params.id);
    const { title, description, deadline, groupsIdList, status, locked, commentsEnabled } = req.body;
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const deletedGroups: number[] | null = taskModule.getDeletedGroupsIdListOnUpdate(groupsIdList, id);
    const addedGroups: number[] | null = taskModule.getAddedGroupsIdListOnUpdate(groupsIdList, id);

    if(deletedGroups == null || addedGroups == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    notifications.sendNotificationToGroups(deletedGroups, "task_removed");
    notifications.sendNotificationToGroups(addedGroups, "task_added");

    const taskId: number | null = taskModule.updateTask(
        id, 
        title, 
        description, 
        deadline, 
        groupsIdList, 
        status, 
        locked, 
        commentsEnabled ?? false,
    );

    if(taskId == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const notifyGroupsIdList = groupsIdList.filter((item: number) => !addedGroups.includes(item));

    notifications.sendNotificationToGroups(notifyGroupsIdList, "task_updated");

    performSuccessResponse(res, taskId, token);
});

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const tasks: Task[] | null = taskModule.getTasks(userId);

    if(tasks == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, tasks, token);
    }
});

router.get('/:id', authMiddleware, (req, res) => {
    const resourceId = Number(req.params.id);
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const task: Task | null = taskModule.getTask(resourceId);

    if(!task){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, task, token);
    }
});

router.delete('/:id', authMiddleware, (req, res) => {
    const resourceId = Number(req.params.id);
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const task: Task | null = taskModule.getTask(resourceId);

    if(!task){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    notifications.sendNotificationToGroups(task.groupsIdList, "task_deleted");

    const success: boolean = taskModule.deleteTask(resourceId);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, resourceId, token);
    }
});

export default router;