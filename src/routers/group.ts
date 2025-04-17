import {Router} from "express";
import {GroupModule} from "../modules/group-module";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";

const router = Router();
const groupModule = new GroupModule();

router.get('/', (req, res) => {
    const groupsList = groupModule.getGroups();

    res.status(200).send({'success': false, 'data': groupsList});
});

router.post('/', (req, res) => {
   const { name, usersIdList } = req.body;

   if(!name || !usersIdList){
       res.status(401).send({'success': false, 'data': INVALID_REQUEST_PARAMETERS});
       return;
   }

   const groupId = groupModule.addGroup(name, usersIdList);

   res.status(200).send({'success': true, 'data': groupId});
});

export default router;