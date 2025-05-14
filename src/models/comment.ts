import { User, UserJson } from "./user";

interface CommentParams {
    id: number;
    userId: number;
    title: string;
    publishDate: string;
    deleted: boolean;
    author: User | null;
}

export type TaskCommentJson = {
    id: number;
    userId: number;
    title: string;
    publishDate: string;
    deleted: boolean;
    author: UserJson | null;
}

export class TaskComment{
    public id: number;
    public userId: number;
    public title: string;
    public publishDate: string;
    public deleted: boolean;
    public author: User | null;

    constructor(params: CommentParams){
        this.id = params.id;
        this.userId = params.userId;
        this.title = params.title;
        this.publishDate = params.publishDate;
        this.deleted = params.deleted;
        this.author = params.author;
    }

    static fromJson(json: TaskCommentJson): TaskComment{
        return new TaskComment({
            id: json.id,
            userId: json.userId,
            title: json.title,
            publishDate: json.publishDate,
            deleted: json.deleted,
            author: null,
        });
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