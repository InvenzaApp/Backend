import FileManager from "../managers/file-manager";
import { Group, GroupJson } from "../models/group";
import IdGetter from "../helpers/id-getter";
import UserModule from "./user-module";
import { User } from "../models/user";

export class GroupModule{
    file = new FileManager("database", "groups");
    userModule = new UserModule();

    constructor() {
        this.file.initializeFile();
    }

    getGroups(userId: number): Group[]{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        return jsonData
            .filter((group: any) => group.usersIdList.some((item: any) => item == userId))
            .map((group: any) => Group.fromJson(group));
    }

    addGroup(
        name: string, 
        usersIdList: number[], 
        locked: boolean
    ): Group {
        const jsonData = this.file.getFileAsJson();

        const newId = IdGetter(jsonData);

        const newGroup = new Group(
            newId,
            name,
            usersIdList,
            null,
            locked
        );

        jsonData.push(newGroup.toJson());

        this.userModule.addGroupToUsers(newId, usersIdList);

        this.file.saveJsonAsFile(jsonData);

        return newGroup;
    }

    getGroup(id: number): Group | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id == id);

        if(!groupJson) return null;

        const group = Group.fromJson(groupJson);

        const tmpList: User[] = [];

        group.usersIdList.forEach((userId: number) => {
            const user = this.userModule.getUserById(userId);

            if(user != null) tmpList.push(user);
        });

        group.usersList = tmpList;

        return group;
    }

    updateGroup(
        groupId: number, 
        name: string, 
        usersIdList: number[], 
        locked: boolean | null
    ): boolean {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id == groupId);

        if(!groupJson) return false;

        groupJson.title = name;
        groupJson.usersIdList = usersIdList;

        if(locked != null){
            groupJson.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);

        return true;        
    }

    getRemovedUsersIdListOnUpdate(
        newUsersIdList: number[], 
        groupId: number
    ): number[] {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const foundGroup: GroupJson | undefined = jsonData.find((group) => group.id === groupId);

        if(!foundGroup) return [];

        const usersIdList: number[] = foundGroup.usersIdList;

        var tmpList: number[] = [];

        usersIdList.forEach((userId) => {
            if(!newUsersIdList.includes(userId)){
                tmpList.push(userId);
            }
        });

        return tmpList;
    }

    getAddedUsersIdListOnUpdate(
        newUsersIdList: number[], 
        groupId: number
    ): number[] {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const foundGroup: GroupJson | undefined = jsonData.find((group) => group.id === groupId);

        if(!foundGroup) return [];

        const usersIdList: number[] = foundGroup.usersIdList;

        var tmpList: number[] = [];

        newUsersIdList.forEach((userId) => {
            if(!usersIdList.includes(userId)){
                tmpList.push(userId);
            }
        });

        return tmpList;
    }

    deleteGroup(groupId: number): boolean{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const filteredData: GroupJson[] = jsonData.filter((item) => item.id !== groupId);

        this.file.saveJsonAsFile(filteredData);

        const success = this.userModule.deleteGroupFromUsers(groupId);

        return success;
    }

    getGroupNameById(id: number): string | null{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id === id);

        if(!groupJson) return null;

        const group = Group.fromJson(groupJson);

        return group.title;
    }

    addUserToGroups(userId: number, groupsIdList: number[]): boolean{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        (groupsIdList ?? []).forEach((groupId) => {
            const groupJson: GroupJson | undefined = jsonData.find((item) => item.id === groupId);

            if(!groupJson) return;

            const group = Group.fromJson(groupJson);

            group.usersIdList.push(userId);
        });

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    deleteUserFromGroups(userId: number): boolean{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        jsonData.forEach((groupJson) => {
            groupJson.usersIdList = groupJson.usersIdList.filter((id) => id !== userId);
        });

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    updateUserGroups(userId: number, groupsIdList: number[]): boolean{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        jsonData.forEach((groupJson) => {
            if(groupsIdList.includes(groupJson.id)){
                if(!groupJson.usersIdList.includes(userId)){
                    groupJson.usersIdList.push(userId);
                }
            }else{
                if(groupJson.usersIdList.includes(userId)){
                    groupJson.usersIdList = groupJson.usersIdList.filter((item) => item != userId);
                }
            }
        });

        this.file.saveJsonAsFile(jsonData);

        return true;
    }
}