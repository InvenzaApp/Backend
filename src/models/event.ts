import { User, UserJson } from "./user";

interface EventParams {
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

export class Event{
    public id: number;
    public organizationId: number;
    public title: string;
    public description: string | null;
    public author: User | null;
    public creatorId: number;
    public dateFrom: string;
    public dateTo: string;
    public locked: boolean;

    constructor(
        params: EventParams
    ){
        this.id = params.id,
        this.organizationId = params.organizationId,
        this.title = params.title,
        this.description = params.description,
        this.author = params.author,
        this.creatorId = params.creatorId,
        this.dateFrom = params.dateFrom,
        this.dateTo = params.dateTo,
        this.locked = params.locked
    }

    static fromJson(json: EventJson): Event{
        return new Event({
            id: json.id,
            organizationId: json.organizationId,
            title: json.title,
            description: json.description,
            author: json.author == null ? null : User.fromJson(json.author),
            creatorId: json.creatorId,
            dateFrom: json.dateFrom,
            dateTo: json.dateTo,
            locked: json.locked,
        });
    }

    toJson(): EventJson{
        return {
            id: this.id,
            organizationId: this.organizationId,
            title: this.title,
            description: this.description,
            author: null,
            creatorId: this.creatorId,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            locked: this.locked,
        }
    }
}