import FileManager from "../managers/file-manager";
import {Organization} from "../models/organization";
import {User} from "../models/user";
import hashPassword from "../helpers/hash-password";

class OrganizationModule {
    file = new FileManager("database", "organization");

    constructor(createDefaultCompany: boolean = false) {
        this.file.initializeFile();

        if(createDefaultCompany && this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        const defaultCompany = new Organization(0, "Invenza", [new User(
            "Administrator",
            "Developer",
            "admin@invenza.pl",
            hashPassword(process.env.DEFAULT_USER_PASSWORD!),
            0,
            [],
        )]);

        this.file.saveJsonAsFile([defaultCompany.toJson()]);
    }

    getOrganizationById(organizationId: number): Organization{
        const jsonData = this.file.getFileAsJson();
        return jsonData.find((json: any) => json.id === organizationId);
    }
}

export default OrganizationModule;