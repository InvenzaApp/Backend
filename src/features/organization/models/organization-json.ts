import { AddressJson } from "../../address/models/address-json";

export type OrganizationJson = {
    id: number;
    title: string;
    usersIdList: number[];
    adminId: number;
    address: AddressJson;
    locked: boolean;
}