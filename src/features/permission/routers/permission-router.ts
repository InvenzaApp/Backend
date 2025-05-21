import {Router} from 'express';
import { authMiddleware } from '../../../authorization/api_authorization';
import { TokenManager } from '../../../managers/token-manager';
import { performSuccessResponse } from '../../../helpers/responses';
import { permissionsList } from '../models/permissions';
import{ Request as ExpressRequest, Response as ExpressResponse } from 'express';


export class PermissionRouter{
    router: Router;
    private tokenManager: TokenManager;

    constructor(){
        this.router = Router();
        this.tokenManager = new TokenManager();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/', authMiddleware, this.get.bind(this));
    }

    get(req: ExpressRequest, res: ExpressResponse){
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        performSuccessResponse(res, permissionsList, token);
    }
}

const permissionRouterInstance = new PermissionRouter();
export default permissionRouterInstance.router;