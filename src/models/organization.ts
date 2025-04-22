import {User} from "./user";
import UserModule from "../modules/user-module";

export type OrganizationJson = {
    id: number;
    name: string;
    usersIdList: number[];
    adminId: number;
}

const userModule = new UserModule();

export class Organization {
    constructor(
        public id: number,
        public name: string,
        public users: User[],
        public admin: User,
    ) {
    }

    static fromJson(json: OrganizationJson): Organization {
        return new Organization(
            json.id,
            json.name,
            userModule.getUsersById(json.usersIdList),
            userModule.getUserById(json.adminId),
        );
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            name: this.name,
            usersIdList: this.users.map(userJson => userJson.id),
            adminId: this.admin.id,
        }
    }
}