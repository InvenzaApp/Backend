import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";

export interface EventUpdatePayload extends UpdatePayload {
    eventId: number;
    title: string;
    description: string | null;
    dateFrom: string;
    dateTo: string;
    locked: boolean | null;
}