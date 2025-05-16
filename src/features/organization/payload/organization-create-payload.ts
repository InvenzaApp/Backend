import { Address } from "../../address/models/address";
import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { User } from "../../user/models/user";

export interface OrganizationCreatePayload extends CreatePayload{
    id: number;
    title: string;
    users: User[];
    admin: User;
    address: Address;
    locked: boolean;
}