import { User } from "../../user/models/user";
import { TaskComment } from "../../comments/models/comment";
import { Group } from "../../group/models/group";
import { ItemEntity } from "../../../core/item-enitity/item-entity";
import { TaskCreatePayload } from "../payload/task-create-payload";
import { TaskJson } from "./task-json";
import { GroupRepository } from "../../group/repository/group-repository";
import { UserRepository } from "../../user/repository/user-repository";

const userRepository = new UserRepository();
const groupModule = new GroupRepository();

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

    constructor(params: TaskCreatePayload) {
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
        const createdBy: User | null = userRepository.get(json.createdById);

        const comments: TaskComment[] = json.comments.map((item) => TaskComment.fromJson(item));

        const groupsList: Group[] | null = json.groupsIdList.flatMap((item) => {
            const group: Group | null = groupModule.get(item);

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