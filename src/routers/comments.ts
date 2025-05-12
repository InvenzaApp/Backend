import { Router } from "express";
import { TokenManager } from "../managers/token-manager";
import { TaskModule } from "../modules/task-module";
import { authMiddleware } from "../authorization/api_authorization";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import UserModule from "../modules/user-module";
import { NotificationsManager } from "../managers/notifications-manager";

const router = Router();
const tokenManager = new TokenManager();
const taskModule = new TaskModule();
const userModule = new UserModule();
const notifications = new NotificationsManager();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const { taskId } = req.body;

    if(taskId == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const comments = taskModule.getComments(taskId);

    comments.forEach((item) => {
        const user = userModule.getUserById(item.userId);
        item.author = user;
    });

    performSuccessResponse(res, comments, token);
});

router.post('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const { taskId, title } = req.body;

    if(taskId == null || title == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    taskModule.addComment(taskId, userId, title);

    const task = taskModule.getTask(taskId);
    notifications.sendNotificationToGroups(task.groupsIdList, "comment_added");

    performSuccessResponse(res, true, token);
});

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const { taskId } = req.body;

    const commentId = Number(req.params.id);

    if(taskId == null || commentId == null){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    taskModule.deleteComment(taskId, commentId);

    performSuccessResponse(res, true, token);
})

export default router;