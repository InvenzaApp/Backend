import { CreatePayload } from "../../../core/repository/models/payload/create-payload";

export interface TokenCreatePayload extends CreatePayload {
    userId: number;
    token: string;
}