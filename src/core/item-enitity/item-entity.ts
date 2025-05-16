export abstract class ItemEntity{
    public id: number;
    public title: string;
    public locked: boolean;

    constructor(id: number, title: string, locked: boolean){
        this.id = id;
        this.title = title;
        this.locked = locked;
    }
}