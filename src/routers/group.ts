import {Router} from "express";
import {GroupModule} from "../modules/group-module";

const router = Router();
const groupModule = new GroupModule();

router.get('/', (req, res) => {
    const groupsList = groupModule.getGroups();

    res.status(200).send({'success': false, 'data': groupsList});
});

export default router;