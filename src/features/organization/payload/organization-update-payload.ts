import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";

export interface OrganizationUpdatePayload extends UpdatePayload{
    organizationId: number;
    title: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string | null;
    postCode: string;
    city: string;
    country: string;
    locked: boolean | null;
}