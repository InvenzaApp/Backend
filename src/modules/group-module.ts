import FileManager from "../managers/file-manager";
import {Group} from "../models/group";
import IdGetter from "../helpers/id-getter";

export class GroupModule{
    file = new FileManager("database", "groups");
    constructor(generateDefaultGroup: boolean = false) {
        this.file.initializeFile();

        if(generateDefaultGroup && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile(){
        const defaultGroup = new Group(
            0,
            "Programiści",
            [0],
        );

        this.file.saveJsonAsFile([defaultGroup.toJson()]);
    }

    getGroups(){
        return this.file.getFileAsJson();
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
}