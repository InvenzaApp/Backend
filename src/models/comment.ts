import { User, UserJson } from "./user";

export type TaskCommentJson = {
    id: number;
    userId: number;
    title: string;
    publishDate: string;
    deleted: boolean;
    author: UserJson | null;
}

export class TaskComment{
    constructor(
        public id: number,
        public userId: number,
        public title: string,
        public publishDate: string,
        public deleted: boolean,
        public author: User | null,
    ){}

    static fromJson(json: TaskCommentJson): TaskComment{
        return new TaskComment(
            json.id,
            json.userId,
            json.title,
            json.publishDate,
            json.deleted,
            null,
        );
    }

    toJson(): TaskCommentJson{
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            publishDate: this.publishDate,
            deleted: this.deleted,
            author: null,
        };
    }
}