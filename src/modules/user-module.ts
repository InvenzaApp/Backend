import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import {User} from "../models/user";
import {adminFaker} from "../fakers/user";
import {USER_EXISTS} from "../helpers/response-codes";
import IdGetter from "../helpers/id-getter";
import { GroupModule } from "./group-module";

require("dotenv").config();

class UserModule {
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

    signIn(email: string, password: string): User | null {
        const jsonData = this.file.getFileAsJson();
        const foundUser = jsonData.find((user: any) => user.email === email && user.password === hashPassword(password));

        if (foundUser) {
            return User.fromJson(foundUser);
        } else {
            return null;
        }
    }

    getUserById(id: number): User {
        const jsonData = this.file.getFileAsJson();
        const userJson = jsonData.find((user: any) => user.id === id);

        return User.fromJson(userJson);
    }

    getUsersById(idList: number[]): User[] {
        const jsonData = this.file.getFileAsJson();
        return jsonData.filter((user: any) => idList.includes(user.id)).map((user: any) => User.fromJson(user));
    }

    deleteGroupFromUsers(groupId: number): void {
        const jsonData = this.file.getFileAsJson();

        const updatedUsers = jsonData.map((user: any) => {
            if (Array.isArray(user.groupsIdList)) {
                user.groupsIdList = user.groupsIdList.filter((id: number) => id !== groupId);
            }
            return user;
        });

        this.file.saveJsonAsFile(updatedUsers);
    }

    getUsers(): User[] {
        const jsonData = this.file.getFileAsJson();
        return jsonData.map((user: any) => User.fromJson(user));
    }

    createUser(organizationId: number, name: string, lastname: string, email: string, password: string, groupsIdList: number[] | null, permissions: string[] | null): User | string {
        const jsonData = this.file.getFileAsJson();

        const userExists = jsonData.find((user: any) => user.email === email);

        if (userExists) {
            return USER_EXISTS;
        }

        const newId = IdGetter(jsonData);

        const newUser = new User(
            newId,
            name, 
            lastname,
            `${name} ${lastname}`,
            email, 
            hashPassword(password), 
            organizationId, 
            groupsIdList ?? [],
            permissions ?? [],
        );

        jsonData.push(newUser.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newUser;
    }

    updateUser(userId: number, name: string, lastname: string, email: string, groupsIdList: number[] | null, permissions: string[] | null){
        const jsonData = this.file.getFileAsJson();
        const user = jsonData.find((item: any) => item.id === userId);

        user.name = name;
        user.lastname = lastname;
        user.title = `${name} ${lastname}`;
        user.email = email;
        user.groupsIdList = groupsIdList ?? [];
        user.permissions = permissions ?? [];

        this.file.saveJsonAsFile(jsonData);
    }

    deleteUser(id: number) {
        const jsonData = this.file.getFileAsJson();
        const newData = jsonData.filter((item: any) => item.id !== id);

        this.file.saveJsonAsFile(newData);
    }

    updatePassword(userId: number, oldPassword: string, newPassword: string, confirmNewPassword: string): boolean{
        const jsonData = this.file.getFileAsJson();
        const user = jsonData.find((item: any) => item.id === userId);

        if(hashPassword(oldPassword) != user.password){
            return false;
        }

        user.password = hashPassword(newPassword);

        this.file.saveJsonAsFile(jsonData);
        return true;
    }

    addGroupToUsers(groupId: number, usersIdList: number[]){
        const jsonData = this.file.getFileAsJson();

        usersIdList.forEach((userId) => {
            const user = jsonData.find((item: any) => item.id === userId);
            user.groupsIdList.push(groupId);
        });

        this.file.saveJsonAsFile(jsonData);
    }

    updateUserGroups(usersIdList: number[], groupId: number){
        const jsonData = this.file.getFileAsJson();

        jsonData.forEach((user: any) => {
            if(usersIdList.includes(user.id)){
                if(!user.groupsIdList.includes(groupId)){
                    user.groupsIdList.push(groupId);
                }
            }else{
                if(user.groupsIdList.includes(groupId)){
                    user.groupsIdList = user.groupsIdList.filter((item: any) => item != groupId);
                }
            }
        });

        this.file.saveJsonAsFile(jsonData);
    }

    updateSelfAccount(userId: number, name: string, lastname: string, email: string): boolean{
        const jsonData = this.file.getFileAsJson();
        const foundUser = jsonData.find((user:any) => user.id === userId);
        const emailTaken = jsonData.find((user: any) => user.email === email);

        if(emailTaken && emailTaken.id !== userId){
            return false;
        }

        if(!foundUser) return false;

        foundUser.name = name;
        foundUser.lastname = lastname;
        foundUser.title = `${name} ${lastname}`;
        foundUser.email = email;

        this.file.saveJsonAsFile(jsonData);
        return true;
    }
}

export default UserModule;