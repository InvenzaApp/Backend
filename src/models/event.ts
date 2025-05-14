import { User, UserJson } from "./user";

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
    constructor(
        public id: number,
        public organizationId: number,
        public title: string,
        public description: string | null,
        public author: User | null,
        public creatorId: number,
        public dateFrom: string,
        public dateTo: string,
        public locked: boolean,
    ){}

    static fromJson(json: EventJson): Event{
        return new Event(
            json.id,
            json.organizationId,
            json.title,
            json.description,
            json.author == null ? null : User.fromJson(json.author),
            json.creatorId,
            json.dateFrom,
            json.dateTo,
            json.locked,
        );
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