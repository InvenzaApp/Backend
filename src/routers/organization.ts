import {Router} from "express";
import OrganizationModule from "../modules/organization-module";
import {performSuccessResponse} from "../helpers/responses";

const router = Router();
const organizationModule = new OrganizationModule();

router.get('/:organizationId', async (req, res) => {
    const organizationId = Number(req.params.organizationId);
    const organization = organizationModule.getOrganizationById(organizationId);

    performSuccessResponse(res, organization);
})

export default router;