import { Request, Response, Router } from "express";
import { TokenManager } from "../../../managers/token-manager";
import { NotificationsManager } from "../../../managers/notifications-manager";
import { RouterRepository } from "../../../core/repository/router-repository";
import { TaskComment } from "../models/comment";
import { TaskRepository } from "../../task/repository/task-repository";
import { CommentsRepository } from "../repository/comments-repository";
import { authMiddleware } from "../../../authorization/api_authorization";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { User } from "../../user/models/user";
import { Task } from "../../task/models/task";
import { UserRepository } from "../../user/repository/user-repository";

export class CommentsRouter extends RouterRepository<TaskComment>{
    router: Router;
    private taskRepository: TaskRepository;
    private notificationsManager: NotificationsManager;
    private tokenManager: TokenManager;
    private userRepository: UserRepository;

    constructor(){
        super(new CommentsRepository());
        this.router = Router();
        this.taskRepository = new TaskRepository();
        this.notificationsManager = new NotificationsManager();
        this.tokenManager = new TokenManager();
        this.userRepository = new UserRepository();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/', authMiddleware, this.getAll.bind(this));
        this.router.post('/', authMiddleware, this.post.bind(this));
        this.router.delete('/:id', authMiddleware, this.delete.bind(this));
    }

    get(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

    getAll(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const { taskId } = req.body;

        if(taskId == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const comments: TaskComment[] | null = this.repository.getAll(taskId);

        if(!comments){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        comments.forEach((item) => {
            const user: User | null = this.userRepository.get(item.userId);

            if(!user){
                performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
                return;
            }

            item.author = user;
        });

        performSuccessResponse(res, comments, token);
    }

    post(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const { taskId, title } = req.body;

        if(taskId == null || title == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success: TaskComment | null = this.repository.add({
            id: taskId, 
            userId: userId, 
            title: title,
        });

        if(!success){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const task: Task | null = this.taskRepository.get(taskId);

        if(!task){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        this.notificationsManager.sendNotificationToGroups(task.groupsIdList, "comment_added");

        performSuccessResponse(res, true, token);
    }

    put(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

    delete(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const resourceId = Number(req.params.id);

        if(resourceId == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success: boolean = this.repository.delete(resourceId);

        if(!success){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }else{
            performSuccessResponse(res, true, token);
        }
    }

}

const commentsRouterInstance = new CommentsRouter();
export default commentsRouterInstance.router;