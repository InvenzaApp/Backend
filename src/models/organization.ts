export type OrganizationJson = {
    id: number;
    name: string;
}

export class Organization {
    constructor(
        public id: number,
        public name: string,
    ) {
    }

    static fromJson(json: OrganizationJson): Organization {
        return new Organization(
            json.id,
            json.name,
        );
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            name: this.name,
        }
    }
}