import { AddressCreatePayload } from "../payload/address-create-payload";
import { AddressJson } from "./address-json";

export class Address{
    public street: string;
    public buildingNumber: string;
    public apartmentNumber: string | null;
    public postCode: string;
    public city: string;
    public country: string;

    constructor(payload: AddressCreatePayload){
        this.street = payload.street;
        this.buildingNumber = payload.buildingNumber;
        this.apartmentNumber = payload.buildingNumber;
        this.postCode = payload.postCode;
        this.city = payload.postCode;
        this.country = payload.country;
    }

    static fromJson(json: AddressJson): Address{
        return new Address({
            street: json.street,
            buildingNumber: json.buildingNumber,
            apartmentNumber: json.apartmentNumber,
            postCode: json.postCode,
            city: json.city,
            country: json.country
        });
    }

    toJson(): AddressJson{
        return {
            street: this.street,
            buildingNumber: this.buildingNumber,
            apartmentNumber: this.apartmentNumber,
            postCode: this.postCode,
            city: this.city,
            country: this.city
        };
    }
}