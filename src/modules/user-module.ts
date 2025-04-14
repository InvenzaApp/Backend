import FileManager from "../managers/file-manager";
import hashPassword from "../helpers/hash-password";
import User from "../models/user";

class UserModule {
    file = new FileManager("database", "users");

    constructor() {
        this.file.initializeFile();
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