import {Router} from "express";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {TaskModule} from "../modules/task-module";

const taskModule = new TaskModule();

const router = Router();

router.post('/', (req, res) => {
    const { title, description, deadline, groupsIdList } = req.body;

    if(!title || !groupsIdList){
        res.status(401).send({'success': false, 'data': INVALID_REQUEST_PARAMETERS});
        return;
    }

    const taskId = taskModule.addTask(title, description, deadline, groupsIdList);

    res.status(200).send({'success': true, 'data': taskId});
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, description, deadline, groupsIdList } = req.body;

    if(!title || !groupsIdList){
        res.status(401).send({'success': false, 'data': INVALID_REQUEST_PARAMETERS});
        return;
    }

    const taskId = taskModule.updateTask(id, title, description, deadline, groupsIdList);

    res.status(200).send({'success': true, 'data': taskId});
});

router.get('/', (req, res) => {
    const tasks = taskModule.getTasks();
    res.status(200).send({'success': true, 'data': tasks});
});

router.get('/:id', (req, res) => {
    const resourceId = Number(req.params.id);

    const task = taskModule.getTask(resourceId);

    res.status(200).send({'success': true, 'data': task});
});

router.delete('/:id', (req, res) => {
    const resourceId = Number(req.params.id);

    taskModule.deleteTask(resourceId);

    res.status(200).send({'success': true, 'data': null});
});

export default router;