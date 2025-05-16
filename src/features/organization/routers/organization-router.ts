import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { Organization } from "../models/organization";
import { OrganizationRepository } from "../repository/organization-repository";
import { TokenManager } from "../../../managers/token-manager";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { authMiddleware } from "../../../authorization/api_authorization";

require("dotenv").config();

export class OrganizationRouter extends RouterRepository<Organization>{
    router: Router;
    private tokenManager: TokenManager;

    constructor(){
        super(new OrganizationRepository());

        this.router = Router();
        this.tokenManager = new TokenManager();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/:id', authMiddleware, this.get.bind(this));
        this.router.post('/organization-update', authMiddleware, this.post.bind(this));
    }

    get(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);
        const resourceId = Number(req.params.id);

        const organization: Organization | null = this.repository.get(resourceId);

        if(!organization){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, organization, token);
        }
    }
    
    getAll(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    
    post(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const { title, street, buildingNumber, apartmentNumber, postCode, city, country, locked } = req.body;

        if(!title || !street || !buildingNumber || !postCode || !city || !country){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const organization: Organization | null = (this.repository as OrganizationRepository).getOrganizationByUserId(userId);

        if(!organization){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success = this.repository.update({
            organizationId: organization.id, 
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
    
    put(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    
    delete(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
}

const organizationRouterInstance = new OrganizationRouter();
export default organizationRouterInstance.router;