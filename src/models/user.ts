export type UserJson = {
    name: string;
    lastname: string;
    email: string;
    password: string;
    organizationId: number;
    groupsIdList: number[];
}

export class User{
    constructor(
        public name: string,
        public lastname: string,
        public email: string,
        public password: string,
        public organizationId: number,
        public groupsIdList: number[],
    ) {}

    static fromJson(json: UserJson): User {
        return new User(
            json.name,
            json.lastname,
            json.email,
            json.password,
            json.organizationId,
            json.groupsIdList,
        );
    }

    toJson(): UserJson {
        return {
            name: this.name,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            organizationId: this.organizationId,
            groupsIdList: this.groupsIdList,
        }
    }
}