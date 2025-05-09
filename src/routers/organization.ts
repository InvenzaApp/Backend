import {Router} from "express";
import OrganizationModule from "../modules/organization-module";
import {performFailureResponse, performSuccessResponse} from "../helpers/responses";
import {TokenManager} from "../managers/token-manager";
import {authMiddleware} from "../authorization/api_authorization";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
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

router.post('/organization-update', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token = tokenManager.getAccessToken(userId);

    const { title, street, buildingNumber, apartmentNumber, postCode, city, country } = req.body;

    if(!title || !street || !buildingNumber || !postCode || !city || !country){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const organization = organizationModule.getOrganizationByUserId(userId);

    const success = organizationModule.updateOrganization(organization.id, title, street, buildingNumber, apartmentNumber, postCode, city, country);
    
    performSuccessResponse(res, success, token);
});

export default router;