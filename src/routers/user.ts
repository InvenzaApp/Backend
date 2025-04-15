import { Router } from "express";
import TokenManager from "../managers/token-manager";
import UserModule from "../modules/user-module";
import {INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS} from "../helpers/response-codes";

const router = Router();
const tokenManager = new TokenManager();
const userModule = new UserModule();

router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(401).send(JSON.stringify({'success': false, 'data': INVALID_REQUEST_PARAMETERS}));
        return;
    }

    const userData = userModule.signIn(email, password);

    if(!userData) {
        res.status(200).send(JSON.stringify({'success': false, 'data': INVALID_CREDENTIALS, 'token': null}))
        return;
    }

    const token = tokenManager.getAccessToken(email);
    res.status(200).send(JSON.stringify({'success': true, 'data': userData.toJson(), 'token': token}));
});

export default router;