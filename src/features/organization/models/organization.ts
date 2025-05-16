import { User } from "../../user/models/user";
import { UserRepository } from "../../user/repository/user-repository";
import { Address } from "../../address/models/address";
import { ItemEntity } from "../../../core/item-enitity/item-entity";
import { OrganizationCreatePayload } from "../payload/organization-create-payload";
import { OrganizationJson } from "./organization-json";

const userRepository = new UserRepository();

export class Organization extends ItemEntity{
    public users: User[];
    public admin: User;
    public address: Address;

    constructor(payload: OrganizationCreatePayload) {
        super(payload.id, payload.title, payload.locked);
        this.users = payload.users;
        this.admin = payload.admin;
        this.address = payload.address;
    }

    static fromJson(json: OrganizationJson): Organization | null {
        const admin: User | null = userRepository.get(json.adminId);
        const users: User[] = userRepository.getUsersById(json.usersIdList);
        const address: Address = Address.fromJson(json.address);

        if(!admin) return null;

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