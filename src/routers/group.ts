import {Router} from "express";
import {GroupModule} from "../modules/group-module";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";

const router = Router();
const groupModule = new GroupModule();

router.get('/', (req, res) => {
    const groupsList = groupModule.getGroups();

    performSuccessResponse(res, groupsList);
});

router.post('/', (req, res) => {
   const { name, usersIdList } = req.body;

   if(!name || !usersIdList){
       performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
       return;
   }

   const groupId = groupModule.addGroup(name, usersIdList);

   performSuccessResponse(res, groupId);
});

export default router;