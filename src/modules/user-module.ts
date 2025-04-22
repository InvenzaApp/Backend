import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import {User} from "../models/user";
import {userFaker} from "../fakers/user";
import {USER_EXISTS} from "../helpers/response-codes";
import IdGetter from "../helpers/id-getter";

require("dotenv").config();

class UserModule {
    file = new FileManager("database", "users");

    constructor(createDefaultUser: boolean = false) {
        this.file.initializeFile();

        if (createDefaultUser && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile() {
        this.file.saveJsonAsFile([userFaker.toJson()]);
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

    createUser(organizationId: number, name: string, lastname: string, email: string, password: string, groupsIdList: number[] | null): User | string {
        const jsonData = this.file.getFileAsJson();

        const userExists = jsonData.find((user: any) => user.email === email);

        if (userExists) {
            return USER_EXISTS;
        }

        const newId = IdGetter(jsonData);

        const newUser = new User(
            newId,
            name, lastname, email, hashPassword(password), organizationId, groupsIdList ?? [],
        );

        jsonData.push(newUser.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newUser;
    }

    updateUser(userId: number, name: string, lastname: string, email: string, groupsIdList: number[] | null){
        const jsonData = this.file.getFileAsJson();
        const user = jsonData.find((item: any) => item.id === userId);

        user.name = name;
        user.lastname = lastname;
        user.email = email;
        user.groups = groupsIdList ?? [];

        this.file.saveJsonAsFile(jsonData);
    }

    deleteUser(id: number) {
        const jsonData = this.file.getFileAsJson();
        const newData = jsonData.filter((item: any) => item.id !== id);

        this.file.saveJsonAsFile(newData);
    }
}

export default UserModule;