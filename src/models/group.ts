export type GroupJson = {
    id: number;
    title: string;
    usersIdList: number[];
    locked: boolean;
}

export class Group{
    constructor(
        public id: number,
        public title: string,
        public usersIdList: number[],
        public locked: boolean,
    ) {}

    static fromJson(json: GroupJson): Group {
        return new Group(
            json.id,
            json.title,
            json.usersIdList,
            json.locked,
        );
    }

    toJson(): GroupJson{
        return {
            id: this.id,
            title: this.title,
            usersIdList: this.usersIdList,
            locked: this.locked,
        }
    }
}