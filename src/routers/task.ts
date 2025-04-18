import {Router} from "express";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {TaskModule} from "../modules/task-module";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {authMiddleware} from "../authorization/api_authorization";
import {TokenManager} from "../managers/token-manager";
import UserModule from "../modules/user-module";

const router = Router();
const taskModule = new TaskModule();
const tokenManager = new TokenManager();
const userModule = new UserModule();

router.post('/', authMiddleware, (req, res) => {
    const { title, description, deadline, groupsIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const user = userModule.getUserById(userId);

    const taskId = taskModule.addTask(title, description, deadline, groupsIdList, user);

    performSuccessResponse(res, taskId, token);
});

router.put('/:id', authMiddleware, (req, res) => {
    const id = Number(req.params.id);
    const { title, description, deadline, groupsIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const taskId = taskModule.updateTask(id, title, description, deadline, groupsIdList);

    performSuccessResponse(res, taskId, token);
});

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const tasks = taskModule.getTasks();
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

    taskModule.deleteTask(resourceId);

    performSuccessResponse(res, resourceId, token);
});

export default router;