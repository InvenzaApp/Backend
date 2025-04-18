import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import {User} from "../models/user";
import {userFaker} from "../fakers/user";
require("dotenv").config();

class UserModule {
    file = new FileManager("database", "users");

    constructor(createDefaultUser: boolean = false) {
        this.file.initializeFile();

        if(createDefaultUser && this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([userFaker.toJson()]);
    }

    signIn(email: string, password: string): User | null {
        const jsonData = this.file.getFileAsJson();
        const foundUser = jsonData.find((user: any) => user.email === email && user.password === hashPassword(password));

        if(foundUser) {
            return User.fromJson(foundUser);
        }else{
            return null;
        }
    }

    getUserById(id: number): User{
        const jsonData = this.file.getFileAsJson();
        const userJson = jsonData.find((user: any) => user.id === id);
        return User.fromJson(userJson);
    }
}

export default UserModule;