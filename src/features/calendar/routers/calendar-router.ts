import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { Event } from "../models/event";
import { CalendarRepository } from "../repository/calendar-repository";
import { TokenManager } from "../../../managers/token-manager";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { authMiddleware } from "../../../authorization/api_authorization";
import { Organization } from "../../organization/models/organization";
import { OrganizationRepository } from "../../organization/repository/organization-repository";

export class CalendarRouter extends RouterRepository<Event>{
    router: Router;
    private tokenManager: TokenManager;
    private organizationRepository: OrganizationRepository;

    constructor(){
        super(new CalendarRepository());

        this.router = Router();
        this.tokenManager = new TokenManager();
        this.organizationRepository = new OrganizationRepository();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/', authMiddleware, this.getAll.bind(this));
        this.router.post('/', authMiddleware, this.post.bind(this));
        this.router.get('/:id', authMiddleware, this.get.bind(this));
        this.router.put('/:id', authMiddleware, this.put.bind(this));
        this.router.delete('/:id', authMiddleware, this.delete.bind(this));
    }

    get(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);
        const resourceId = Number(req.params.id);

        const event: Event | null = this.repository.get(resourceId);

        if(!event){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, event, token);
        } 
    }
    
    getAll(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const events: Event[] | null = this.repository.getAll(userId);

        if(events == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, events, token);
        }
    }
    
    post(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const { title, description, dateFrom, dateTo, locked } = req.body;

        if(!title || !dateFrom || !dateTo){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const organization: Organization | null = this.organizationRepository.getOrganizationByUserId(userId);

        if(!organization){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const event = this.repository.add({
            creatorId: userId, 
            organizationId: organization.id, 
            title: title, 
            description: description, 
            dateFrom: dateFrom, 
            dateTo: dateTo, 
            locked: locked ?? false,
        });

        if(event == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, event.id, token);
        }
    }
    
    put(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);
        const resourceId = Number(req.params.id);

        const { title, description, dateFrom, dateTo, locked } = req.body;

        if(!title || !dateFrom || !dateTo){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success: number | null = this.repository.update({
            eventId: resourceId, 
            title: title, 
            description: description, 
            dateFrom: dateFrom, 
            dateTo: dateTo, 
            locked: locked,
        });

        if(success == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, resourceId, token);
        }
    }
    
    delete(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);
        const resourceId = Number(req.params.id);

        const success: boolean = this.repository.delete(resourceId);

        if(!success){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, true, token);
        }
    }
}

const calendarRouterInstance = new CalendarRouter();
export default calendarRouterInstance.router;