import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { Task } from "../models/task";
import { TokenManager } from "../../../managers/token-manager";
import { NotificationsManager } from "../../../managers/notifications-manager";
import { TaskRepository } from "../repository/task-repository";
import { authMiddleware } from "../../../authorization/api_authorization";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { User } from "../../user/models/user";
import { UserRepository } from "../../user/repository/user-repository";

require("dotenv").config();

export class TaskRouter extends RouterRepository<Task>{
    public router: Router;
    private tokenManager: TokenManager;
    private userRepository: UserRepository;
    private notifications: NotificationsManager;

    constructor(){
        super(new TaskRepository());
        this.router = Router();
        this.tokenManager = new TokenManager();
        this.userRepository = new UserRepository();
        this.notifications = new NotificationsManager();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/:id', authMiddleware, this.get.bind(this));
        this.router.get('/', authMiddleware, this.getAll.bind(this));
        this.router.post('/', authMiddleware, this.post.bind(this));
        this.router.put('/:id', authMiddleware, this.put.bind(this));
        this.router.delete('/:id', authMiddleware, this.delete.bind(this));
    }

    get(req: Request, res: Response): void {
        const resourceId = Number(req.params.id);
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const task: Task | null = this.repository.get(resourceId);

        if(!task){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, task, token);
        }
    }
    
    getAll(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const tasks: Task[] | null = this.repository.getAll(userId, organizationId);

        if(tasks == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, tasks, token);
        }
    }

    post(req: Request, res: Response): void {
        const { title, description, deadline, groupsIdList, locked, commentsEnabled } = req.body;
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        if(!title || !groupsIdList){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const user: User | null = this.userRepository.get(userId);

        if(!user){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const task = this.repository.add({
            title: title, 
            description: description, 
            deadline: deadline, 
            groupsIdList: groupsIdList, 
            createdBy: user, 
            locked: locked ?? false, 
            commentsEnabled: commentsEnabled ?? true,
        });

        if(!task){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        this.notifications.sendNotificationToGroups(groupsIdList, "task_created");

        performSuccessResponse(res, task.id, token);
    }

    put(req: Request, res: Response): void {
        const id = Number(req.params.id);
        const { title, description, deadline, groupsIdList, status, locked, commentsEnabled } = req.body;
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        if(!title || !groupsIdList){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const deletedGroups: number[] | null = (this.repository as TaskRepository).getDeletedGroupsIdListOnUpdate(groupsIdList, id);
        const addedGroups: number[] | null = (this.repository as TaskRepository).getAddedGroupsIdListOnUpdate(groupsIdList, id);

        if(deletedGroups == null || addedGroups == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        this.notifications.sendNotificationToGroups(deletedGroups, "task_removed");
        this.notifications.sendNotificationToGroups(addedGroups, "task_added");

        const taskId: number | null = this.repository.update({
            id: id, 
            title: title, 
            description: description, 
            deadline: deadline, 
            groupsIdList: groupsIdList, 
            status: status, 
            locked: locked, 
            commentsEnabled: commentsEnabled ?? false,
        });

        if(taskId == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const notifyGroupsIdList = groupsIdList.filter((item: number) => !addedGroups.includes(item));

        this.notifications.sendNotificationToGroups(notifyGroupsIdList, "task_updated");

        performSuccessResponse(res, taskId, token);
    }

    delete(req: Request, res: Response): void {
        const resourceId = Number(req.params.id);
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const task: Task | null = this.repository.get(resourceId);

        if(!task){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        this.notifications.sendNotificationToGroups(task.groupsIdList, "task_deleted");

        const success: boolean = this.repository.delete(resourceId);

        if(!success){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, resourceId, token);
        }
    }
}

const taskRouterInstace = new TaskRouter();
export default taskRouterInstace.router;