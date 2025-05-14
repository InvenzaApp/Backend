import UserModule from "../modules/user-module";
import { User, UserJson } from "./user";

interface GroupParams{
    id: number;
    title: string;
    usersIdList: number[];
    usersList: User[] | null;
    locked: boolean;
}

export type GroupJson = {
    id: number;
    title: string;
    usersIdList: number[];
    usersList: UserJson[] | null;
    locked: boolean;
}

export class Group{
    public id: number;
    public title: string;
    public usersIdList: number[];
    public usersList: User[] | null;
    public locked: boolean;
    userModule = new UserModule();

    constructor(params: GroupParams) {
        this.id = params.id;
        this.title = params.title;
        this.usersIdList = params.usersIdList;
        this.usersList = params.usersList;
        this.locked = params.locked;
    }

    static fromJson(json: GroupJson) {
        return new Group({
            id: json.id,
            title: json.title,
            usersIdList: json.usersIdList,
            usersList: null,
            locked: json.locked,
        });
    }

    toJson(): GroupJson{
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.usersIdList,
            usersList: null,
            locked: this.locked,
        }
    }
}