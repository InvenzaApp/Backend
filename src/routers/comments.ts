import { Router } from "express";
import { TokenManager } from "../managers/token-manager";
import { TaskModule } from "../modules/task-module";
import { authMiddleware } from "../authorization/api_authorization";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import UserModule from "../modules/user-module";
import { NotificationsManager } from "../managers/notifications-manager";
import { TaskComment } from "../models/comment";
import { User } from "../models/user";
import { Task } from "../models/task";

const router = Router();
const tokenManager = new TokenManager();
const taskModule = new TaskModule();
const userModule = new UserModule();
const notifications = new NotificationsManager();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { taskId } = req.body;

    if(taskId == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const comments: TaskComment[] | null = taskModule.getComments(taskId);

    if(!comments){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    comments.forEach((item) => {
        const user: User | null = userModule.getUserById(item.userId);

        if(!user){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        item.author = user;
    });

    performSuccessResponse(res, comments, token);
});

router.post('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { taskId, title } = req.body;

    if(taskId == null || title == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success: boolean = taskModule.addComment(taskId, userId, title);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const task: Task | null = taskModule.getTask(taskId);

    if(!task){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    notifications.sendNotificationToGroups(task.groupsIdList, "comment_added");

    performSuccessResponse(res, true, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { taskId } = req.body;

    const resourceId = Number(req.params.id);

    if(taskId == null || resourceId == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success: boolean = taskModule.deleteComment(taskId, resourceId);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }else{
        performSuccessResponse(res, true, token);
    }
})

export default router;