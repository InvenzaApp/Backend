import FileManager from "../managers/file-manager";
import {Group} from "../models/group";
import IdGetter from "../helpers/id-getter";
import UserModule from "./user-module";
import {User} from "../models/user";

export class GroupModule{
    file = new FileManager("database", "groups");
    userModule = new UserModule();
    constructor() {
        this.file.initializeFile();
    }

    getGroups(userId: number): Group[]{
        const jsonData = this.file.getFileAsJson();

        return jsonData
            .filter((group: any) => group.usersIdList.some((item: any) => item == userId))
            .map((group: any) => Group.fromJson(group));
    }

    addGroup(name: string, usersIdList: number[], locked: boolean): number {
        const jsonData = this.file.getFileAsJson();
        const newId = IdGetter(jsonData);

        const newGroup = new Group(
            newId,
            name,
            usersIdList,
            locked
        );

        jsonData.push(newGroup.toJson());

        this.userModule.addGroupToUsers(newId, usersIdList);

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

    updateGroup(groupId: number, name: string, usersIdList: number[], locked: boolean | null) {
        const jsonData = this.file.getFileAsJson();

        const group = jsonData.find((item: any) => item.id == groupId);

        group.title = name;
        group.usersIdList = usersIdList;

        if(locked != null){
            group.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);
    }

    getRemovedUsersIdListOnUpdate(newUsersIdList: number[], groupId: number): number[] {
        const jsonData = this.file.getFileAsJson();

        const foundGroup = jsonData.find((group: any) => group.id === groupId);

        if(!foundGroup) return [];

        const usersIdList = foundGroup.usersIdList;

        var tmpList: number[] = [];

        usersIdList.forEach((userId: number) => {
            if(!newUsersIdList.includes(userId)){
                tmpList.push(userId);
            }
        });

        return tmpList;
    }

    getAddedUsersIdListOnUpdate(newUsersIdList: number[], groupId: number): number[] {
        const jsonData = this.file.getFileAsJson();

        const foundGroup = jsonData.find((group: any) => group.id === groupId);

        if(!foundGroup) return [];

        const usersIdList = foundGroup.usersIdList;

        var tmpList: number[] = [];

        newUsersIdList.forEach((userId: number) => {
            if(!usersIdList.includes(userId)){
                tmpList.push(userId);
            }
        });

        return tmpList;
    }

    deleteGroup(groupId: number){
        const jsonData = this.file.getFileAsJson();
        const filteredData = jsonData.filter((item: any) => item.id !== groupId);
        this.file.saveJsonAsFile(filteredData);
        this.userModule.deleteGroupFromUsers(groupId);
    }

    getGroupNameById(id: number): string{
        const jsonData = this.file.getFileAsJson();
        const group = jsonData.find((item: any) => item.id === id);

        return group.title;
    }

    addUserToGroups(userId: number, groupsIdList: number[]){
        const jsonData = this.file.getFileAsJson();

        (groupsIdList ?? []).forEach((groupId) => {
            const group = jsonData.find((item: any) => item.id === groupId);
            group.usersIdList.push(userId);
        });

        this.file.saveJsonAsFile(jsonData);
    }

    deleteUserFromGroups(userId: number){
        const jsonData = this.file.getFileAsJson();

        jsonData.forEach((group: any) => {
            group.usersIdList = group.usersIdList.filter((id: any) => id !== userId);
        });

        this.file.saveJsonAsFile(jsonData);
    }

    updateUserGroups(userId: number, groupsIdList: number[]){
        const jsonData = this.file.getFileAsJson();

        jsonData.forEach((group: any) => {
            if(groupsIdList.includes(group.id)){
                if(!group.usersIdList.includes(userId)){
                    group.usersIdList.push(userId);
                }
            }else{
                if(group.usersIdList.includes(userId)){
                    group.usersIdList = group.usersIdList.filter((item: any) => item != userId);
                }
            }
        });

        this.file.saveJsonAsFile(jsonData);
    }
}