import {User} from "./user";
import UserModule from "../modules/user-module";
import { TaskComment, TaskCommentJson } from "./comment";
import { Group, GroupJson } from "./group";
import { GroupModule } from "../modules/group-module";
import { ItemEntity } from "../core/item-entity";

interface TaskParams{
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    groupsList: Group[] | null;
    createdAt: string;
    createdBy: User;
    status: string;
    locked: boolean;
    comments: TaskComment[];
    commentsEnabled: boolean;
}

export type TaskJson = {
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    groupsList: GroupJson[] | null;
    createdAt: string;
    createdById: number;
    status: string;
    locked: boolean;
    comments: TaskCommentJson[];
    commentsEnabled: boolean;
}

const userModule = new UserModule();
const groupModule = new GroupModule();

export class Task extends ItemEntity{
    public description: string | null;
    public deadline: string | null;
    public groupsIdList: number[];
    public groupsList: Group[] | null;
    public createdAt: string;
    public createdBy: User;
    public status: string;
    public comments: TaskComment[];
    public commentsEnabled: boolean;

    constructor(params: TaskParams) {
        super(params.id, params.title, params.locked);
        this.id = params.id;
        this.title = params.title;
        this.description = params.description;
        this.deadline = params.deadline;
        this.groupsIdList = params.groupsIdList;
        this.groupsList = params.groupsList;
        this.createdAt = params.createdAt;
        this.createdBy = params.createdBy;
        this.status = params.status;
        this.locked = params.locked;
        this.comments = params.comments;
        this.commentsEnabled = params.commentsEnabled;
    }

    static fromJson(json: TaskJson): Task | null {
        const createdBy: User | null = userModule.getUserById(json.createdById);

        const comments: TaskComment[] = json.comments.map((item) => TaskComment.fromJson(item));

        const groupsList: Group[] | null = json.groupsIdList.flatMap((item) => {
            const group: Group | null = groupModule.getGroup(item);

            if(!group) return [];

            return group;
        });

        if(!createdBy) return null;

        return new Task({
            id: json.id,
            title: json.title,
            description: json.description,
            deadline: json.deadline,
            groupsIdList: json.groupsIdList,
            groupsList: groupsList,
            createdAt: json.createdAt,
            createdBy: createdBy,
            status: json.status,
            locked: json.locked,
            comments: comments,
            commentsEnabled: json.commentsEnabled,
        });
    }

    toJson(): TaskJson | null{
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            deadline: this.deadline,
            groupsIdList: this.groupsIdList,
            groupsList: null,
            createdAt: this.createdAt,
            createdById: this.createdBy.id,
            status: this.status,
            locked: this.locked,
            comments: this.comments.map((comment) => comment.toJson()),
            commentsEnabled: this.commentsEnabled,
        }
    }
}