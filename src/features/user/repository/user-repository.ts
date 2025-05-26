import FileManager from "../../../managers/file-manager";
import hashPassword from "../../../helpers/hash-password";
import { User } from "../models/user";
import IdGetter from "../../../helpers/id-getter";
import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import { UserCreatePayload } from "../payload/user-create-payload";
import { UserUpdatePayload } from "../payload/user-update-payload";
import { UserJson } from "../models/user-json";
import { defaultAdminModel, defaultAppleModel, defaultGoogleModel } from "../../../database-models/user";

require("dotenv").config();

export class UserRepository extends CockpitRepository<User> {
    private file: FileManager; 

    constructor() {
        super();
        this.file = new FileManager("database", "users");
        this.file.initializeFile();

        if (this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    add(payload: UserCreatePayload): User | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userExists: UserJson | undefined = jsonData.find((user) => user.email === payload.email);

        if (userExists) return null;

        const newId: number = IdGetter(jsonData);

        const newUser = new User({
            id: newId,
            name: payload.name,
            lastname: payload.lastname,
            title: `${payload.name} ${payload.lastname}`,
            email: payload.email,
            password: hashPassword(payload.password),
            organizationsIdList: payload.organizationsIdList,
            groupsIdList: payload.groupsIdList ?? [],
            groups: null,
            permissions: payload.permissions ?? [],
            admin: payload.admin,
            superadmin: payload.superadmin,
            locked: payload.locked ?? false,
        });

        jsonData.push(newUser.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newUser;
    }

    get(resourceId: number): User | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const userJson: UserJson | undefined = jsonData.find((item) => item.id === resourceId);

        if (!userJson) return null;

        return User.fromJson(userJson);
    }

    getAll(resourceId: number): User[] | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const filteredData: UserJson[] | null = jsonData.filter((item) => item.organizationsIdList.includes(resourceId));

        return filteredData.map((user) => User.fromJson(user));
    }

    update(payload: UserUpdatePayload): number | null {
        const jsonData: UserJson[] = this.file.getFileAsJson();
        const userJson: UserJson | undefined = jsonData.find((item) => item.id === payload.userId);

        if (!userJson) return null;
        
        userJson.organizationsIdList = payload.organizationsIdList;
        userJson.name = payload.name;
        userJson.lastname = payload.lastname;
        userJson.title = `${payload.name} ${payload.lastname}`;
        userJson.email = payload.email;
        userJson.groupsIdList = payload.groupsIdList ?? [];
        userJson.permissions = payload.permissions ?? [];

        if (payload.admin != null) {
            userJson.admin = payload.admin;
        }

        if (payload.locked != null) {
            userJson.locked = payload.locked;
        }

        if(payload.superadmin != null){
            userJson.superadmin = payload.superadmin;
        }

        this.file.saveJsonAsFile(jsonData);

        return payload.userId;
    }

    delete(resourceId: number): boolean {
        const jsonData: UserJson[] = this.file.getFileAsJson();

        const filteredData: UserJson[] = jsonData.filter((item) => item.id !== resourceId);

        this.file.saveJsonAsFile(filteredData);

        return true;
    }

    private initializeFile() {
        this.file.saveJsonAsFile([
            defaultAdminModel.toJson(),
            defaultGoogleModel.toJson(),
            defaultAppleModel.toJson()
        ]);
    }
}