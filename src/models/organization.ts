import {User, UserJson} from "./user";

export type OrganizationJson = {
    id: number;
    name: string;
    users: UserJson[];
}

export class Organization {
    constructor(
        public id: number,
        public name: string,
        public users: User[],
    ) {
    }

    static fromJson(json: OrganizationJson): Organization {
        return new Organization(
            json.id,
            json.name,
            json.users.map(userJson => User.fromJson(userJson)),
        );
    }

    toJson(): OrganizationJson {
        return {
            id: this.id,
            name: this.name,
            users: this.users.map(userJson => User.fromJson(userJson)),
        }
    }
}