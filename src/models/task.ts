import {User} from "./user";
import UserModule from "../modules/user-module";
import { TaskComment, TaskCommentJson } from "./comment";

export type TaskJson = {
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    createdAt: string;
    createdById: number;
    status: string;
    locked: boolean;
    comments: TaskCommentJson[];
    commentsEnabled: boolean;
}

const userModule = new UserModule();

export class Task{
    constructor(
        public id: number,
        public title: string,
        public description: string | null,
        public deadline: string | null,
        public groupsIdList: number[],
        public createdAt: string,
        public createdBy: User,
        public status: string,
        public locked: boolean,
        public comments: TaskComment[],
        public commentsEnabled: boolean,
    ) {}

    static fromJson(json: TaskJson): Task {
        return new Task(
            json.id,
            json.title,
            json.description,
            json.deadline,
            json.groupsIdList,
            json.createdAt,
            userModule.getUserById(json.createdById),
            json.status,
            json.locked,
            json.comments.map((json: any) => TaskComment.fromJson(json)),
            json.commentsEnabled,
        );
    }

    toJson(): TaskJson {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            deadline: this.deadline,
            groupsIdList: this.groupsIdList,
            createdAt: this.createdAt,
            createdById: this.createdBy.id,
            status: this.status,
            locked: this.locked,
            comments: this.comments.map((comment) => comment.toJson()),
            commentsEnabled: this.commentsEnabled,
        }
    }
}