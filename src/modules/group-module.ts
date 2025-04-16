import FileManager from "../managers/file-manager";
import {Group} from "../models/group";

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
}