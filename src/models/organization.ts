import {User} from "./user";
import UserModule from "../modules/user-module";

export type OrganizationJson = {
    id: number;
    title: string;
    usersIdList: number[];
    adminId: number;
}

const userModule = new UserModule();

export class Organization {
    constructor(
        public id: number,
        public title: string,
        public users: User[],
        public admin: User,
    ) {
    }

    static fromJson(json: OrganizationJson): Organization {
        return new Organization(
            json.id,
            json.title,
            userModule.getUsersById(json.usersIdList),
            userModule.getUserById(json.adminId),
        );
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.users.map(userJson => userJson.id),
            adminId: this.admin.id,
        }
    }
}