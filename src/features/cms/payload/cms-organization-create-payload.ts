import { Address } from "../../address/models/address";
import { User } from "../../user/models/user";

export interface CmsOrganizationCreatePayload {
    id: number;
    title: string;
    admin: User;
    address: Address;
}