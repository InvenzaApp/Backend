import { Router } from "express"
import { authMiddleware } from "../authorization/api_authorization";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { NotificationsManager } from "../managers/notifications-manager";
import { TokenManager } from "../managers/token-manager";

const router = Router();
const notifications = new NotificationsManager();
const tokenManager = new TokenManager();

router.post('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const requestToken: string = tokenManager.getAccessToken(userId);
    
    const { token } = req.body;

    if(!token){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success = notifications.registerToken(userId, token);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, null, requestToken);
    }
});

export default router;