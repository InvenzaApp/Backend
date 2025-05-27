import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { Organization } from "../models/organization";
import { OrganizationRepository } from "../repository/organization-repository";
import { TokenManager } from "../../../managers/token-manager";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { authMiddleware } from "../../../authorization/api_authorization";
import { organizationMiddleware } from "../../../authorization/organization_authorization";
import { UserRepository } from "../../user/repository/user-repository";
import { Address } from "../../address/models/address";

require("dotenv").config();

export class OrganizationRouter extends RouterRepository<Organization>{
    router: Router;
    private tokenManager: TokenManager;
    private userRepository: UserRepository;

    constructor(){
        super(new OrganizationRepository());

        this.router = Router();
        this.tokenManager = new TokenManager();
        this.userRepository = new UserRepository();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/:id', authMiddleware, this.get.bind(this));
        this.router.get('/', organizationMiddleware, this.getAll.bind(this));
        this.router.put('/:id', authMiddleware, this.put.bind(this));
        this.router.post('/', organizationMiddleware, this.post.bind(this));

        this.router.post('/select-organization', organizationMiddleware, this.selectOrganization.bind(this));
    }

    get(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);
        const resourceId = Number(req.params.id);

        const organization: Organization | null = this.repository.get(resourceId);

        if(!organization){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, organization, token);
        }
    }
    
    getAll(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getOrganizationToken(userId);

        const organizationsList: Organization[] | null = this.repository.getAll(userId, 0);

        if(organizationsList == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, organizationsList, token);
        }
    }
    
    post(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token = this.tokenManager.getOrganizationToken(userId);

        const { title, street, buildingNumber, apartmentNumber, postCode, city, country } = req.body;

        const user = this.userRepository.get(userId);

        if(user == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }


        if(
            title == null ||
            street == null ||
            buildingNumber == null ||
            postCode == null ||
            city == null ||
            country == null
        ){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const address = new Address({
            street: street,
            buildingNumber: buildingNumber,
            apartmentNumber: apartmentNumber ?? null,
            postCode: postCode,
            city: city,
            country: country
        });

        const organization = this.repository.add({
            title: title,
            users: [user],
            admin: user,
            address: address,
            locked: false,
        });

        if(organization == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, organization.id, token);
        }
    }
    
    put(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const { title, street, buildingNumber, apartmentNumber, postCode, city, country, locked } = req.body;

        if(!title || !street || !buildingNumber || !postCode || !city || !country){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success = this.repository.update({
            organizationId: organizationId, 
            title: title, 
            street: street, 
            buildingNumber: buildingNumber, 
            apartmentNumber: apartmentNumber, 
            postCode: postCode, 
            city: city, 
            country: country, 
            locked: locked,
        });

        if(success == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, success, token);
        }
    }
    
    delete(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

    selectOrganization(req: Request, res: Response): void{
        const { userId } = (req as any).user;
        const { organizationId } = req.body;

        if(organizationId == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        performSuccessResponse(res, true, token);
    }
}

const organizationRouterInstance = new OrganizationRouter();
export default organizationRouterInstance.router;