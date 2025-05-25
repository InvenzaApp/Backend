import { Group } from "../../group/models/group";
import { UserCreatePayload } from "../payload/user-create-payload";
import { UserJson } from "./user-json";

export class User{
    public id: number;
    public name: string;
    public lastname: string;
    public title: string;
    public email: string;
    public password: string;
    public organizationsIdList: number[];
    public groupsIdList: number[];
    public groups: Group[] | null;
    public permissions: string[];
    public admin: boolean;
    public superadmin: boolean;
    public locked: boolean;

    constructor(params: UserCreatePayload) {
        this.id = params.id;
        this.name = params.name;
        this.lastname = params.lastname;
        this.title = params.title;
        this.email = params.email;
        this.password = params.password;
        this.organizationsIdList = params.organizationsIdList;
        this.groupsIdList = params.groupsIdList;
        this.groups = params.groups;
        this.permissions = params.permissions;
        this.admin = params.admin;
        this.superadmin = params.superadmin;
        this.locked = params.locked;
    }

    static fromJson(json: UserJson): User {
        return new User({
            id: json.id,
            name: json.name,
            lastname: json.lastname,
            title: json.title,
            email: json.email,
            password: json.password,
            organizationsIdList: json.organizationsIdList,
            groupsIdList: json.groupsIdList,
            groups: null,
            permissions: json.permissions,
            admin: json.admin,
            superadmin: json.superadmin,
            locked: json.locked,
        });
    }

    toJson(): UserJson {
        const groupsJson = this.groups == null ? null : this.groups.map((item) => item.toJson());
    
        return {
            id: this.id,
            name: this.name,
            lastname: this.lastname,
            title: this.title,
            email: this.email,
            password: this.password,
            organizationsIdList: this.organizationsIdList,
            groupsIdList: this.groupsIdList,
            groups: groupsJson,
            permissions: this.permissions,
            admin: this.admin,
            superadmin: this.superadmin,
            locked: this.locked,
        }
    }
}