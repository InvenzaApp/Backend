import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { User } from "../../user/models/user";

export interface EventCreatePayload extends CreatePayload {
    id: number;
    organizationId: number;
    title: string;
    description: string | null;
    author: User | null;
    creatorId: number;
    dateFrom: string;
    dateTo: string;
    locked: boolean;
}