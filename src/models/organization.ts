import {User} from "./user";
import UserModule from "../modules/user-module";
import { Address, AddressJson } from "./address";

export type OrganizationJson = {
    id: number;
    title: string;
    usersIdList: number[];
    adminId: number;
    address: AddressJson
}

const userModule = new UserModule();

export class Organization {
    constructor(
        public id: number,
        public title: string,
        public users: User[],
        public admin: User,
        public address: Address,
    ) {
    }

    static fromJson(json: OrganizationJson): Organization {
        return new Organization(
            json.id,
            json.title,
            userModule.getUsersById(json.usersIdList),
            userModule.getUserById(json.adminId),
            Address.fromJson(json.address),
        );
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.users.map(userJson => userJson.id),
            adminId: this.admin.id,
            address: this.address.toJson()
        }
    }
}