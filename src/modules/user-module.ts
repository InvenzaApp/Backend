import FileManager from "../managers/file-manager";

class UserModule {
    file = new FileManager("database", "users");

    constructor() {
        this.file.initializeFile();
    }
}

export default UserModule;