import FileManager from "../managers/file-manager";
import {Group} from "../models/group";
import IdGetter from "../helpers/id-getter";
import {groupFaker} from "../fakers/group";

export class GroupModule{
    file = new FileManager("database", "groups");
    constructor(generateDefaultGroup: boolean = false) {
        this.file.initializeFile();

        if(generateDefaultGroup && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([groupFaker.toJson()]);
    }

    getGroups(): Group[]{
        const jsonData = this.file.getFileAsJson();

        return jsonData.map((group: any) => Group.fromJson(group));
    }

    addGroup(name: string, usersIdList: number[]): number {
        const jsonData = this.file.getFileAsJson();
        const newId = IdGetter(jsonData);

        const newGroup = new Group(
            newId,
            name,
            usersIdList,
        );

        jsonData.push(newGroup.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newId;
    }

    getGroup(id: number): Group {
        const jsonData = this.file.getFileAsJson();
        const group = jsonData.find((item: any)=> item.id == id);

        return Group.fromJson(group);
    }
}