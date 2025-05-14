import { Router } from "express";
import { CalendarModule } from "../modules/calendar-module";
import { authMiddleware } from "../authorization/api_authorization";
import { TokenManager } from "../managers/token-manager";
import { performFailureResponse, performSuccessResponse } from "../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../helpers/response-codes";
import { Event } from "../models/event";
import OrganizationModule from "../modules/organization-module";
import { Organization } from "../models/organization";

const router = Router();
const calendar = new CalendarModule();
const tokenManager = new TokenManager();
const organizationModule = new OrganizationModule();

router.get('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const events: Event[] = calendar.getEvents();

    performSuccessResponse(res, events, token);
});

router.post('/', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);

    const { title, description, dateFrom, dateTo, locked } = req.body;

    if(!title || !dateFrom || !dateTo){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const organization: Organization | null = organizationModule.getOrganizationByUserId(userId);

    if(!organization){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const event = calendar.addEvent(
        userId, 
        organization.id, 
        title, 
        description, 
        dateFrom, 
        dateTo, 
        locked ?? false
    );

    performSuccessResponse(res, event.id, token);
});

router.get('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const resourceId = Number(req.params.id);

    const event: Event | null = calendar.getEvent(resourceId);

    if(!event){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, event, token);
    }
});

router.put('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const resourceId = Number(req.params.id);

    const { title, description, dateFrom, dateTo, locked } = req.body;

    if(!title || !dateFrom || !dateTo){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        return;
    }

    const success: boolean = calendar.updateEvent(resourceId, title, description, dateFrom, dateTo, locked);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, resourceId, token);
    }
});

router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = (req as any).user;
    const token: string = tokenManager.getAccessToken(userId);
    const resourceId = Number(req.params.id);

    const success: boolean = calendar.deleteEvent(resourceId);

    if(!success){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
    }else{
        performSuccessResponse(res, true, token);
    }
});

export default router;