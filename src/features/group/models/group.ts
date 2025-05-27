import { User } from "../../user/models/user";
import { GroupCreatePayload } from "../payload/group-create-payload";
import { GroupJson } from "./group-json";

export class Group{
    public id: number;
    public title: string;
    public usersIdList: number[];
    public organizationsIdList: number[];
    public usersList: User[] | null;
    public locked: boolean;

    constructor(params: GroupCreatePayload) {
        this.id = params.id;
        this.title = params.title;
        this.usersIdList = params.usersIdList;
        this.organizationsIdList = params.organizationsIdList;
        this.usersList = params.usersList;
        this.locked = params.locked;
    }

    static fromJson(json: GroupJson) {
        return new Group({
            id: json.id,
            title: json.title,
            usersIdList: json.usersIdList,
            organizationsIdList: json.organizationsIdList,
            usersList: null,
            locked: json.locked,
        });
    }

    toJson(): GroupJson{
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.usersIdList,
            organizationsIdList: this.organizationsIdList,
            usersList: null,
            locked: this.locked,
        }
    }
}