import { User } from "../../user/models/user";
import { EventCreatePayload } from "../payload/event-create-payload";
import { EventJson } from "./event-json";

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

    constructor(payload: EventCreatePayload){
        this.id = payload.id;
        this.organizationId = payload.organizationId;
        this.title = payload.title;
        this.description = payload.description;
        this.author = payload.author;
        this.creatorId = payload.creatorId;
        this.dateFrom = payload.dateFrom;
        this.dateTo = payload.dateTo;
        this.locked = payload.locked;
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