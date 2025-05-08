import {Router} from "express";
import OrganizationModule from "../modules/organization-module";
import {performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";
import {authMiddleware} from "../authorization/api_authorization";
require("dotenv").config();

const router = Router();
const organizationModule = new OrganizationModule();
const tokenManager = new TokenManager();

router.get('/:organizationId', authMiddleware, (req, res) => {
    const organizationId = Number(req.params.organizationId);
    const organization = organizationModule.getOrganizationById(organizationId);
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    performSuccessResponse(res, organization, token);
})

export default router;