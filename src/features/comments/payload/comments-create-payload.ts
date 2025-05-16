import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { User } from "../../user/models/user";

export interface CommentsCreatePayload extends CreatePayload {
    id: number;
    userId: number;
    title: string;
    publishDate: string;
    deleted: boolean;
    author: User | null;
}