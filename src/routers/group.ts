import {Router} from "express";
import {GroupModule} from "../modules/group-module";
import {INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {authMiddleware} from "../authorization/api_authorization";
import {TokenManager} from "../managers/token-manager";

const router = Router();
const groupModule = new GroupModule();
const tokenManager = new TokenManager()

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const groupsList = groupModule.getGroups();

    performSuccessResponse(res, groupsList, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);
    const groupId = Number(req.params.id);

    const group = groupModule.getGroup(groupId);

    performSuccessResponse(res, group, token);
});

router.post('/', authMiddleware, (req, res) => {
   const { name, usersIdList } = req.body;
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

   if(!name || !usersIdList){
       performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
       return;
   }

   const groupId = groupModule.addGroup(name, usersIdList);

   performSuccessResponse(res, groupId, token);
});

export default router;