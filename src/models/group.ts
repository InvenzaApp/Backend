export type GroupJson = {
    id: number;
    name: string;
    usersIdList: number[];
}

export class Group{
    constructor(
        public id: number,
        public name: string,
        public usersIdList: number[],
    ) {}

    static fromJson(json: GroupJson): Group {
        return new Group(
            json.id,
            json.name,
            json.usersIdList,
        );
    }

    toJson(): GroupJson{
        return {
            id: this.id,
            name: this.name,
            usersIdList: this.usersIdList,
        }
    }
}