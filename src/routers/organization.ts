import {Router} from "express";
import OrganizationModule from "../modules/organization-module";
import {performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";
import {authMiddleware} from "../authorization/api_authorization";
import {delay} from "../helpers/delay";
require("dotenv").config();

const router = Router();
const organizationModule = new OrganizationModule();
const tokenManager = new TokenManager();
const isDebug = process.env.DEBUG;
const delayTime = (process.env.DELAY || 300) as number;

router.get('/:organizationId', authMiddleware, async (req, res) => {
    const organizationId = Number(req.params.organizationId);
    const organization = organizationModule.getOrganizationById(organizationId);
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    if(isDebug){
        await delay(delayTime);
    }

    performSuccessResponse(res, organization, token);
})

export default router;