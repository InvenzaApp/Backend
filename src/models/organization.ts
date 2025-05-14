import { User } from "./user";
import UserModule from "../modules/user-module";
import { Address, AddressJson } from "./address";

interface OrganizationParams{
    id: number;
    title: string;
    users: User[];
    admin: User;
    address: Address;
    locked: boolean;
}

export type OrganizationJson = {
    id: number;
    title: string;
    usersIdList: number[];
    adminId: number;
    address: AddressJson;
    locked: boolean;
}

const userModule = new UserModule();

export class Organization {
    public id: number;
    public title: string;
    public users: User[];
    public admin: User;
    public address: Address;
    public locked: boolean;

    constructor(params: OrganizationParams) {
        this.id = params.id,
        this.title = params.title,
        this.users = params.users,
        this.admin = params.admin,
        this.address = params.address,
        this.locked = params.locked
    }

    static fromJson(json: OrganizationJson): Organization | null {
        const admin: User | undefined = userModule.getUserById(json.adminId);
        const users: User[] | undefined = userModule.getUsersById(json.usersIdList);
        const address: Address | undefined = Address.fromJson(json.address);

        if(!admin) return null;
        if(!users) return null;
        if(!address) return null;

        return new Organization({
            id: json.id,
            title: json.title,
            users: users,
            admin: admin,
            address: address,
            locked: json.locked,
        });
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.users.map(userJson => userJson.id),
            adminId: this.admin.id,
            address: this.address.toJson(),
            locked: this.locked,
        }
    }
}