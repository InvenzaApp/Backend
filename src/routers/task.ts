import {Router} from "express";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {TaskModule} from "../modules/task-module";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";

const router = Router();
const taskModule = new TaskModule();

router.post('/', (req, res) => {
    const { title, description, deadline, groupsIdList } = req.body;

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const taskId = taskModule.addTask(title, description, deadline, groupsIdList);

    performSuccessResponse(res, taskId);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, description, deadline, groupsIdList } = req.body;

    if(!title || !groupsIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const taskId = taskModule.updateTask(id, title, description, deadline, groupsIdList);

    performSuccessResponse(res, taskId);
});

router.get('/', (req, res) => {
    const tasks = taskModule.getTasks();
    performSuccessResponse(res, tasks);
});

router.get('/:id', (req, res) => {
    const resourceId = Number(req.params.id);

    const task = taskModule.getTask(resourceId);

    performSuccessResponse(res, task);
});

router.delete('/:id', (req, res) => {
    const resourceId = Number(req.params.id);

    taskModule.deleteTask(resourceId);

    performSuccessResponse(res, resourceId);
});

export default router;