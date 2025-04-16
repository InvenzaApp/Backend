import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import {User} from "../models/user";
import {Organization} from "../models/organization";
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
        const defaultCompany = new Organization(0, "Invenza");
        const defaultUser = new User(
            "Administrator",
            "Developer",
            "admin@invenza.pl",
            hashPassword(process.env.DEFAULT_USER_PASSWORD!),
            defaultCompany,
            [],
        );

        this.file.saveJsonAsFile([defaultUser.toJson()]);
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
}

export default UserModule;