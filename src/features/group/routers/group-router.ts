import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { Group } from "../models/group";
import { TaskRepository } from "../../task/repository/task-repository";
import { TokenManager } from "../../../managers/token-manager";
import { NotificationsManager } from "../../../managers/notifications-manager";
import { GroupRepository } from "../repository/group-repository";
import { authMiddleware } from "../../../authorization/api_authorization";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_REQUEST_PARAMETERS } from "../../../helpers/response-codes";
import { UserRepository } from "../../user/repository/user-repository";

require("dotenv").config();

export class GroupRouter extends RouterRepository<Group>{
    router: Router;
    private userRepository: UserRepository;
    private taskRepository: TaskRepository;
    private tokenManager: TokenManager;
    private notificationsManager: NotificationsManager;

    constructor(){
        super(new GroupRepository());
        this.router = Router();
        this.userRepository = new UserRepository();
        this.taskRepository = new TaskRepository();
        this.tokenManager = new TokenManager();
        this.notificationsManager = new NotificationsManager();
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
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);
        const groupId = Number(req.params.id);

        const group: Group | null = this.repository.get(groupId);

        if(!group){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }else{
            performSuccessResponse(res, group, token);
        }
    }

    getAll(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const groupsList: Group[] | null = this.repository.getAll(userId);

        if(groupsList == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        }else{
            performSuccessResponse(res, groupsList, token);
        }
    }

    post(req: Request, res: Response): void {
        const { name, usersIdList, locked } = req.body;
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        if(!name || !usersIdList){
        performFailureResponse(res, INVALID_REQUEST_PARAMETERS)
        return;
        }

        const group: Group | null = this.repository.add({
            title: name, 
            usersIdList: usersIdList, 
            locked: locked ?? false
        });

        if(!group){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        this.notificationsManager.sendNotificationToUsers(usersIdList, "group_created");

        performSuccessResponse(res, group.id, token);
    }

    put(req: Request, res: Response): void {
        const { name, usersIdList, locked } = req.body;
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);

        const groupRepository = new GroupRepository();

        if(!name || !usersIdList){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const groupId = Number(req.params.id);

        const deletedUsers: number[] = groupRepository.getRemovedUsersIdListOnUpdate(usersIdList, groupId);
        const addedUsers: number[] = groupRepository.getAddedUsersIdListOnUpdate(usersIdList, groupId);

        this.notificationsManager.sendNotificationToUsers(deletedUsers, "group_removed");
        this.notificationsManager.sendNotificationToUsers(addedUsers, "group_added");

        const groupSuccess = this.repository.update({
            id: groupId, 
            title: name, 
            usersIdList: usersIdList, 
            locked: locked,
        });

        if(groupSuccess == null){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const userSuccess = this.userRepository.updateUserGroups(usersIdList, groupId);

        if(!userSuccess){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const notifyUsersIdList: number[] = usersIdList.filter((userId: number) => !addedUsers.includes(userId));

        this.notificationsManager.sendNotificationToUsers(notifyUsersIdList, "group_updated");

        performSuccessResponse(res, groupId, token);
    }

    delete(req: Request, res: Response): void {
        const { userId, organizationId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId, organizationId);
        const groupId = Number(req.params.id);

        this.notificationsManager.sendNotificationToGroup(groupId, "group_deleted");

        const groupSuccess = this.repository.delete(groupId);

        if(!groupSuccess){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const taskSuccess = this.taskRepository.removeGroupFromTasks(groupId);
        
        if(!taskSuccess){
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        performSuccessResponse(res, groupId, token);
    }
}

const groupRouterInstance = new GroupRouter();
export default groupRouterInstance.router;