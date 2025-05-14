import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import { User, UserJson } from "../models/user";
import { adminFaker } from "../fakers/user";
import { USER_EXISTS } from "../helpers/response-codes";
import IdGetter from "../helpers/id-getter";
import { Group } from "../models/group";
import { GroupModule } from "./group-module";

require("dotenv").config();

export class UserModule {
    file = new FileManager("database", "users");

    constructor() {
        this.file.initializeFile();

        if (this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile() {
        this.file.saveJsonAsFile([
            adminFaker.toJson(),
        ]);
    }

    signIn(
        email: string, 
        password: string
    ): User | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userJson: UserJson | undefined = jsonData.find((item) => {
            return item.email === email && item.password === hashPassword(password);
        });

        if (userJson) {
            const user = User.fromJson(userJson);

            return user;
        } else {
            return null;
        }
    }

    getUserById(id: number): User | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userJson: UserJson | undefined = jsonData.find((item) => item.id === id);

        if(!userJson) return null;

        return User.fromJson(userJson);
    }

    getUsersById(idList: number[]): User[] {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        return jsonData
            .filter((item) => idList.includes(item.id))
            .map((item) => User.fromJson(item));
    }

    deleteGroupFromUsers(groupId: number): boolean {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const updatedUsers: User[] = jsonData
        .map((item: any) => {
            if (Array.isArray(item.groupsIdList)) {
                item.groupsIdList = item.groupsIdList.filter((id: number) => id !== groupId);
            }
            return item;
        });

        this.file.saveJsonAsFile(updatedUsers);

        return true;
    }

    getUsers(): User[] {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        return jsonData.map((user) => User.fromJson(user));
    }

    createUser(
        organizationId: number, 
        name: string, 
        lastname: string, 
        email: string, 
        password: string, 
        groupsIdList: number[] | null, 
        permissions: string[] | null, 
        admin: boolean, 
        locked: boolean
    ): User | string {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userExists: UserJson | undefined = jsonData.find((user) => user.email === email);

        if (userExists) {
            return USER_EXISTS;
        }

        const newId: number = IdGetter(jsonData);

        const newUser = new User({
            id: newId,
            name: name, 
            lastname: lastname,
            title: `${name} ${lastname}`,
            email: email, 
            password: hashPassword(password), 
            organizationId: organizationId, 
            groupsIdList: groupsIdList ?? [],
            groups: null,
            permissions: permissions ?? [],
            admin: admin,
            locked: locked ?? false,
        });

        jsonData.push(newUser.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newUser;
    }

    updateUser(
        userId: number, 
        name: string, 
        lastname: string, 
        email: string, 
        groupsIdList: number[] | null, 
        permissions: string[] | null, 
        admin: boolean | null, 
        locked: boolean | null
    ): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();
        const userJson: UserJson | undefined = jsonData.find((item) => item.id === userId);

        if(!userJson) return false;

        userJson.name = name;
        userJson.lastname = lastname;
        userJson.title = `${name} ${lastname}`;
        userJson.email = email;
        userJson.groupsIdList = groupsIdList ?? [];
        userJson.permissions = permissions ?? [];
        
        if(admin != null){
            userJson.admin = admin;
        }

        if(locked != null){
            userJson.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    deleteUser(id: number): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const filteredData: UserJson[] = jsonData.filter((item) => item.id !== id);

        this.file.saveJsonAsFile(filteredData);

        return true;
    }

    updatePassword(
        userId: number, 
        oldPassword: string, 
        newPassword: string
    ): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();
        const userJson: UserJson | undefined = jsonData.find((item) => item.id === userId);

        if(!userJson) return false;

        if(hashPassword(oldPassword) != userJson.password){
            return false;
        }

        userJson.password = hashPassword(newPassword);

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    addGroupToUsers(
        groupId: number, 
        usersIdList: number[]
    ): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();

        usersIdList.forEach((userId) => {
            const userJson: UserJson | undefined = jsonData.find((item: any) => item.id === userId);
            if(userJson) userJson.groupsIdList.push(groupId);
        });

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    updateUserGroups(
        usersIdList: number[], 
        groupId: number
    ): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();

        jsonData.forEach((item) => {
            if(usersIdList.includes(item.id)){
                if(!item.groupsIdList.includes(groupId)){
                    item.groupsIdList.push(groupId);
                }
            }else{
                if(item.groupsIdList.includes(groupId)){
                    item.groupsIdList = item.groupsIdList.filter((itemId) => itemId != groupId);
                }
            }
        });

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    updateSelfAccount(
        userId: number, 
        name: string, 
        lastname: string, 
        email: string
    ): boolean{
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userJson: UserJson | undefined = jsonData.find((user:any) => user.id === userId);
        
        if(!userJson) return false;

        const existingUserJson: UserJson | undefined = jsonData.find((user: any) => user.email === email);

        if(existingUserJson && existingUserJson.id !== userId){
            return false;
        }

        userJson.name = name;
        userJson.lastname = lastname;
        userJson.title = `${name} ${lastname}`;
        userJson.email = email;

        this.file.saveJsonAsFile(jsonData);
        
        return true;
    }
}

export default UserModule;