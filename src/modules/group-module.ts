import FileManager from "../managers/file-manager";
import {Group} from "../models/group";
import IdGetter from "../helpers/id-getter";
import {groupFaker} from "../fakers/group";
import UserModule from "./user-module";
import {User} from "../models/user";

export class GroupModule{
    file = new FileManager("database", "groups");
    userModule = new UserModule();
    constructor(generateDefaultGroup: boolean = false) {
        this.file.initializeFile();

        if(generateDefaultGroup && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([groupFaker.toJson()]);
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

    getGroup(id: number): any {
        const jsonData = this.file.getFileAsJson();
        const group = jsonData.find((item: any) => item.id == id);

        const tmpList: User[] = [];

        group.usersIdList.forEach((userId: number) => {
            const user = this.userModule.getUserById(userId);
            tmpList.push(user);
        });

        group.usersList = tmpList.map((user: User) => user.toJson());

        return group;
    }

    deleteGroup(groupId: number){
        const jsonData = this.file.getFileAsJson();
        const filteredData = jsonData.filter((item: any) => item.id !== groupId);
        this.file.saveJsonAsFile(filteredData);
    }

    getGroupNameById(id: number): string{
        const jsonData = this.file.getFileAsJson();
        const group = jsonData.find((item: any) => item.id === id);

        return group.name;
    }
}