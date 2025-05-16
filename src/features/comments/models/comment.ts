import { ItemEntity } from "../../../core/item-enitity/item-entity";
import { User } from "../../user/models/user";
import { CommentsCreatePayload } from "../payload/comments-create-payload";
import { TaskCommentJson } from "./comment-json";

export class TaskComment extends ItemEntity{
    public userId: number;
    public publishDate: string;
    public deleted: boolean;
    public author: User | null;

    constructor(params: CommentsCreatePayload){
        super(params.id, params.title, false);
        this.userId = params.userId;
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