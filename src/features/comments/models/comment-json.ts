import { UserJson } from "../../user/models/user-json";

export type TaskCommentJson = {
    id: number;
    userId: number;
    title: string;
    publishDate: string;
    deleted: boolean;
    author: UserJson | null;
}