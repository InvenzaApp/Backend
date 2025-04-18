import { Router } from "express";
import UserModule from "../modules/user-module";
import {INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";

const router = Router();
const tokenManager = new TokenManager();
const userModule = new UserModule();

router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const userData = userModule.signIn(email, password);

    if(!userData) {
        performFailureResponse(res, INVALID_CREDENTIALS);
        return;
    }

    const token = tokenManager.getAccessToken(userData.id);
    performSuccessResponse(res, userData.toJson(), token);
});

export default router;