import {Router} from "express";
import OrganizationModule from "../modules/organization-module";

const router = Router();
const organizationModule = new OrganizationModule();

router.get('/:organizationId', async (req, res) => {
    const organizationId = Number(req.params.organizationId);
    const organization = organizationModule.getOrganizationById(organizationId);

    res.status(200).send({'success': true, 'data': organization});
})

export default router;