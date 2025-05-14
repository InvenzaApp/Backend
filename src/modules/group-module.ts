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

        const filteredData: GroupJson[] = jsonData.filter((groupJson) => {
            return groupJson.usersIdList.some((item) => item === userId);
        });

        const groupsList: Group[] = filteredData.flatMap((item) => {
            const group = Group.fromJson(item);

            if(!group) return [];

            const usersList: User[] = this.userModule.getUsersById(group.usersIdList);

            group.usersList = usersList;

            return group;
        });

        return groupsList;
            
    }

    addGroup(
        title: string, 
        usersIdList: number[], 
        locked: boolean
    ): Group | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newGroup = new Group({
            id: newId,
            title: title,
            usersIdList: usersIdList,
            usersList: null,
            locked: locked,
        });

        jsonData.push(newGroup.toJson());

        const success = this.userModule.addGroupToUsers(newId, usersIdList);

        this.file.saveJsonAsFile(jsonData);

        return success ? newGroup : null;
    }

    getGroup(id: number): Group | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id == id);

        if(!groupJson) return null;

        const group = Group.fromJson(groupJson);

        if(!group) return null;

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

        if(!group) return null;

        return group.title;
    }

    addUserToGroups(userId: number, groupsIdList: number[]): boolean{
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        (groupsIdList ?? []).forEach((groupId) => {
            const groupJson: GroupJson | undefined = jsonData.find((item) => item.id === groupId);

            if(!groupJson) return;

            const group = Group.fromJson(groupJson);

            if(group) group.usersIdList.push(userId);
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