import { Request, Response, Router } from "express";
import { RouterRepository } from "../../../core/repository/router-repository";
import { UserRepository } from "../repository/user-repository";
import { User } from "../models/user";
import { TokenManager } from "../../../managers/token-manager";
import { performFailureResponse, performSuccessResponse } from "../../../helpers/responses";
import { INVALID_CREDENTIALS, INVALID_REQUEST_PARAMETERS, USER_EXISTS } from "../../../helpers/response-codes";
import { GroupRepository } from "../../group/repository/group-repository";
import { Group } from "../../group/models/group";
import { Organization } from "../../organization/models/organization";
import { authMiddleware } from "../../../authorization/api_authorization";
import { OrganizationRepository } from "../../organization/repository/organization-repository";
import { SettingsRepository } from "../../settings/repository/settings-repository";
require("dotenv").config();

export class UserRouter extends RouterRepository<User> {
    router: Router;
    private tokenManager: TokenManager;
    private groupRepository: GroupRepository;
    private organizationRepository: OrganizationRepository;
    private settingsRepository: SettingsRepository;

    constructor() {
        super(new UserRepository());

        this.router = Router();
        this.tokenManager = new TokenManager();
        this.groupRepository = new GroupRepository();
        this.organizationRepository = new OrganizationRepository();
        this.settingsRepository = new SettingsRepository();

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.getAll.bind(this));
        this.router.get('/:id', authMiddleware, this.get.bind(this));
        this.router.post('/', authMiddleware, this.post.bind(this));
        this.router.put('/:id', authMiddleware, this.put.bind(this));
        this.router.delete('/:id', authMiddleware, this.delete.bind(this));

        this.router.post('/sign-in', this.signIn.bind(this));
        this.router.post('/update-password', authMiddleware, this.updatePassword.bind(this));
        this.router.post('/update-user', authMiddleware, this.updateUser.bind(this));
        this.router.get('/get-user/:id', authMiddleware, this.getUser.bind(this));
    }

    get(req: Request, res: Response): void {
        const resourceId = Number(req.params.id);
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const user: User | null = this.repository.get(resourceId);
        const groups: Group[] | null = this.groupRepository.getAll(resourceId);

        if (!user) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        user.groups = groups;

        performSuccessResponse(res, user, token);
    }

    getAll(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const usersList: User[] | null = this.repository.getAll(userId);

        if (usersList == null) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        } else {
            performSuccessResponse(res, usersList, token);
        }
    }

    post(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const { name, lastname, email, password, groupsIdList, permissions, admin, locked } = req.body;

        if (!name || !lastname || !email || !password) {
            performFailureResponse(res, INVALID_CREDENTIALS);
            return;
        }

        const organization: Organization | null = this.organizationRepository.getOrganizationByUserId(userId);

        if (!organization) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const data: User | null = this.repository.add({
            organizationId: organization.id,
            name: name,
            lastname: lastname,
            email: email,
            password: password,
            groupsIdList: groupsIdList,
            permissions: permissions,
            admin: admin ?? false,
            locked: locked ?? false,
        });

        if (!data) {
            performFailureResponse(res, INVALID_CREDENTIALS);
            return;
        }

        const organizationSuccess: boolean = this.organizationRepository.addUser(organization.id, data);

        if (!organizationSuccess) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const groupSuccess: boolean = this.groupRepository.addUserToGroups(data.id, groupsIdList);

        if (!groupSuccess) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        performSuccessResponse(res, data.id, token);
    }

    put(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);
        const resourceId = Number(req.params.id);
        const { name, lastname, email, groupsIdList, permissions, admin, locked } = req.body;

        if (!name || !lastname || !email) {
            performFailureResponse(res, INVALID_CREDENTIALS);
            return;
        }

        const userSuccess: number | null = this.repository.update({
            userId: resourceId,
            name: name,
            lastname: lastname,
            email: email,
            groupsIdList: groupsIdList,
            permissions: permissions,
            admin: admin,
            locked: locked,
        });

        if (!userSuccess) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const groupSuccess: boolean = this.groupRepository.updateUserGroups(resourceId, groupsIdList ?? []);

        if (!groupSuccess) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        performSuccessResponse(res, resourceId, token);
    }

    delete(req: Request, res: Response): void {
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const resourceId = Number(req.params.id);

        const organization: Organization | null = this.organizationRepository.getOrganizationByUserId(resourceId);

        if (!organization) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const settingsSuccess: boolean = this.settingsRepository.removeLanguage(resourceId);
        const userSuccess: boolean = this.repository.delete(resourceId);
        const groupSuccess: boolean = this.groupRepository.deleteUserFromGroups(resourceId);
        const organizationSuccess: boolean = this.organizationRepository.deleteUser(organization.id, resourceId);

        if (!settingsSuccess || !userSuccess || !groupSuccess || !organizationSuccess) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        performSuccessResponse(res, resourceId, token);
    }

    signIn(req: Request, res: Response): void{
        const { email, password } = req.body;
        const locale: string | undefined = req.get('locale');

        if (!email || !password) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return
        }

        const user = (this.repository as UserRepository).signIn(email, password);

        if (!user) {
            performFailureResponse(res, INVALID_CREDENTIALS);
            return;
        }

        const groupsList: Group[] = user.groupsIdList.flatMap((item) => {
            const group: Group | null = this.groupRepository.get(item);

            if (!group) return [];

            return group;
        })

        user.groups = groupsList;

        const token: string = this.tokenManager.getAccessToken(user.id);
        const success = this.settingsRepository.changeLanguage(user.id, locale);

        if (!success) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        } else {
            performSuccessResponse(res, user.toJson(), token);
        }
    }

    updatePassword(req: Request, res: Response): void{
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success = (this.repository as UserRepository).updatePassword(userId, oldPassword, newPassword);

        performSuccessResponse(res, success, token);
    }

    updateUser(req: Request, res: Response): void{
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const { name, lastname, email } = req.body;

        if (!name || !lastname || !email) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
            return;
        }

        const success: boolean = (this.repository as UserRepository).updateSelfAccount(userId, name, lastname, email);

        if (success) {
            performSuccessResponse(res, success, token);
        } else {
            performFailureResponse(res, USER_EXISTS);
        }
    }

    getUser(req: Request, res: Response): void{
        const { userId } = (req as any).user;
        const token: string = this.tokenManager.getAccessToken(userId);

        const resourceId = Number(req.params.id);

        const user: User | null = this.repository.get(resourceId);

        if (!user) {
            performFailureResponse(res, INVALID_REQUEST_PARAMETERS);
        } else {
            performSuccessResponse(res, user, token);
        }
    }
}

const userRouterInstance = new UserRouter();
export default userRouterInstance.router;