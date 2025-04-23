export type GroupJson = {
    id: number;
    title: string;
    usersIdList: number[];
}

export class Group{
    constructor(
        public id: number,
        public title: string,
        public usersIdList: number[],
    ) {}

    static fromJson(json: GroupJson): Group {
        return new Group(
            json.id,
            json.title,
            json.usersIdList,
        );
    }

    toJson(): GroupJson{
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.usersIdList,
        }
    }
}