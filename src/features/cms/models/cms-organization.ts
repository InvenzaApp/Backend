import { Address } from "../../address/models/address";
import { User } from "../../user/models/user";
import { CmsOrganizationCreatePayload } from "../payload/cms-organization-create-payload";

export class CmsOrganization{
    public id: number;
    public title: string;
    public admin: User;
    public address: Address;

    constructor(payload: CmsOrganizationCreatePayload){
        this.id = payload.id;
        this.title = payload.title;
        this.admin = payload.admin;
        this.address = payload.address;
    }
}