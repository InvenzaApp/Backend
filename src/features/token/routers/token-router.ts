import { Router } from "express"
import { authMiddleware } from "../../../authorization/api_authorization";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { NotificationsManager } from "../../../managers/notifications-manager";
import { TokenManager } from "../../../managers/token-manager";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { organizationMiddleware } from "../../../authorization/organization_authorization";

export class TokenRouter{
    router: Router;
    private notificationsManager: NotificationsManager;
    private tokenManager: TokenManager;

    constructor(){
        this.router = Router();
        this.notificationsManager = new NotificationsManager();
        this.tokenManager = new TokenManager();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post('/', organizationMiddleware, this.post.bind(this));
    }

    post(req: ExpressRequest, res: ExpressResponse){
        const { userId } = (req as any).user;
        const requestToken: string = this.tokenManager.getOrganizationToken(userId);
        
        const { token } = req.body;

        if(!token){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success = this.notificationsManager.registerToken(userId, token);

        if(!success){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, null, requestToken);
        }
    }
}

const tokenRouterInstance = new TokenRouter();
export default tokenRouterInstance.router;