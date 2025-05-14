import { User, UserJson } from "./user";
import UserModule from "../modules/user-module";

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

const userModule = new UserModule();

export class Group{
    public id: number;
    public title: string;
    public usersIdList: number[];
    public usersList: User[] | null;
    public locked: boolean;

    constructor(params: GroupParams) {
        this.id = params.id,
        this.title = params.title,
        this.usersIdList = params.usersIdList,
        this.usersList = params.usersList,
        this.locked = params.locked
    }

    static fromJson(json: GroupJson): Group | null {
        const usersList: User[] | undefined = userModule.getUsersById(json.usersIdList);

        if(!usersList) return null;

        return new Group({
            id: json.id,
            title: json.title,
            usersIdList: json.usersIdList,
            usersList: usersList,
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