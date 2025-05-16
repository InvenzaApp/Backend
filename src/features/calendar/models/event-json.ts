import { UserJson } from "../../user/models/user-json";

export type EventJson = {
    id: number;
    organizationId: number;
    title: string;
    description: string | null;
    author: UserJson | null;
    creatorId: number;
    dateFrom: string;
    dateTo: string;
    locked: boolean;
}