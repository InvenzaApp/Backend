export type UserJson = {
    id: number;
    name: string;
    lastname: string;
    title: string;
    email: string;
    password: string;
    organizationId: number;
    groupsIdList: number[];
    permissions: string[];
    admin: boolean;
    locked: boolean;
}

export class User{
    constructor(
        public id: number,
        public name: string,
        public lastname: string,
        public title: string,
        public email: string,
        public password: string,
        public organizationId: number,
        public groupsIdList: number[],
        public permissions: string[],
        public admin: boolean,
        public locked: boolean,
    ) {}

    static fromJson(json: UserJson): User {
        return new User(
            json.id,
            json.name,
            json.lastname,
            json.title,
            json.email,
            json.password,
            json.organizationId,
            json.groupsIdList,
            json.permissions,
            json.admin,
            json.locked,
        );
    }

    toJson(): UserJson {
        return {
            id: this.id,
            name: this.name,
            lastname: this.lastname,
            title: this.title,
            email: this.email,
            password: this.password,
            organizationId: this.organizationId,
            groupsIdList: this.groupsIdList,
            permissions: this.permissions,
            admin: this.admin,
            locked: this.locked,
        }
    }
}