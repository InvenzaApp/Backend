import {User} from "./user";
import UserModule from "../modules/user-module";

export type TaskJson = {
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    createdAt: string;
    createdById: number;
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
        }
    }
}