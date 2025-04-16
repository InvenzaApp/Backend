import {Organization, OrganizationJson} from "./organization";

export type UserJson = {
    id: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
    organization: OrganizationJson;
    groupsIdList: number[];
}

export class User{
    constructor(
        public id: number,
        public name: string,
        public lastname: string,
        public email: string,
        public password: string,
        public organization: Organization,
        public groupsIdList: number[],
    ) {}

    static fromJson(json: UserJson): User {
        return new User(
            json.id,
            json.name,
            json.lastname,
            json.email,
            json.password,
            Organization.fromJson(json.organization),
            json.groupsIdList,
        );
    }

    toJson(): UserJson {
        return {
            id: this.id,
            name: this.name,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            organization: this.organization.toJson(),
            groupsIdList: this.groupsIdList,
        }
    }
}