interface AddressParams {
    street: string;
    buildingNumber: string;
    apartmentNumber: string | null;
    postCode: string;
    city: string;
    country: string;
}

export type AddressJson = {
    street: string;
    buildingNumber: string;
    apartmentNumber: string | null;
    postCode: string;
    city: string;
    country: string;
}

export class Address{
    public street: string;
    public buildingNumber: string;
    public apartmentNumber: string | null;
    public postCode: string;
    public city: string;
    public country: string;

    constructor(params: AddressParams){
        this.street = params.street;
        this.buildingNumber = params.buildingNumber;
        this.apartmentNumber = params.buildingNumber;
        this.postCode = params.postCode;
        this.city = params.postCode;
        this.country = params.country;
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