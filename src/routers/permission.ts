import {Router} from 'express';
import { authMiddleware } from '../authorization/api_authorization';
import { TokenManager } from '../managers/token-manager';
import { performSuccessResponse } from '../helpers/responses';
import { permissionsList } from '../models/permissions';

const router = Router();
const tokenManager = new TokenManager();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    performSuccessResponse(res, permissionsList, token);
});

export default router;