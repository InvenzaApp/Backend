export type AddressJson = {
    street: string;
    buildingNumber: string;
    apartmentNumber: string | null;
    postCode: string;
    city: string;
    country: string;
}

export class Address{
    constructor(
        public street: string,
        public buildingNumber: string,
        public apartmentNumber: string | null,
        public postCode: string,
        public city: string,
        public country: string
    ){}

    static fromJson(json: AddressJson): Address{
        return new Address(
            json.street,
            json.buildingNumber,
            json.apartmentNumber,
            json.postCode,
            json.city,
            json.country
        );
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