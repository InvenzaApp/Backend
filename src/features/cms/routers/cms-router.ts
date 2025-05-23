import { Router, Request, Response } from "express";
import { UserRepository } from "../../user/repository/user-repository";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { TokenManager } from "../../../managers/token-manager";
import { OrganizationRepository } from "../../organization/repository/organization-repository";
import { CmsRepository } from "../repository/cms-repository";
import { OrganizationCreatePayload } from "../../organization/payload/organization-create-payload";
import { Address } from "../../address/models/address";

export class CmsRouter {
    router: Router;
    private userRepository: UserRepository;
    private tokenManager: TokenManager;
    private organizationRepository: OrganizationRepository;
    private cmsRepository: CmsRepository;

    constructor() {
        this.router = Router();

        this.userRepository = new UserRepository();
        this.tokenManager = new TokenManager();
        this.organizationRepository = new OrganizationRepository();
        this.cmsRepository = new CmsRepository();

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', this.signIn.bind(this));
        this.router.post('/get-organizations', this.getOrganizations.bind(this));
        this.router.post('/add-organization', this.createOrganization.bind(this));
    }

    signIn(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const user = this.userRepository.signIn(email, password);

        if (user == null) {
            performFailureResponse(res, INVALID_CREDENTIALS);
        } else {
            performSuccessResponse(res, user, this.tokenManager.getOrganizationToken(user.id));
        }
    }

    getOrganizations(req: Request, res: Response) {
        const { userId } = req.body;

        if (userId == null) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const organizationsList = this.cmsRepository.getOrganizations();


        performSuccessResponse(res, organizationsList, this.tokenManager.getOrganizationToken(userId));
    }

    createOrganization(req: Request, res: Response){
        const {
            userId,
            title,
            street,
            apartmentNumber,
            buildingNumber,
            postCode,
            city,
            country
        } = req.body;

        if(
            userId == null || 
            !title || 
            street == null ||
            apartmentNumber == null ||
            postCode == null ||
            city == null ||
            country == null
        ){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const admin = this.userRepository.get(userId);

        if(admin == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const newOrganization: OrganizationCreatePayload = {
            id: 0,
            title: title,
            users: [admin],
            admin: admin,
            locked: false,
            address: new Address({
                street: street,
                apartmentNumber: apartmentNumber,
                buildingNumber: buildingNumber,
                postCode: postCode,
                city: city,
                country: country,
            })
        }

        this.organizationRepository.add(newOrganization);

        performSuccessResponse(res, null, this.tokenManager.getOrganizationToken(userId));
    }
}

const cmsRouterInstance = new CmsRouter();
export default cmsRouterInstance.router;