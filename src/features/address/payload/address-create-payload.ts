import { CreatePayload } from "../../../core/repository/models/payload/create-payload";

export interface AddressCreatePayload extends CreatePayload {
    street: string;
    buildingNumber: string;
    apartmentNumber: string | null;
    postCode: string;
    city: string;
    country: string;
}