import FileManager from "../managers/file-manager";
import {Organization} from "../models/organization";
import {organizationFaker} from "../fakers/organization";
import {User} from "../models/user";

class OrganizationModule {
    file = new FileManager("database", "organization");

    constructor(createDefaultCompany: boolean = false) {
        this.file.initializeFile();

        if(createDefaultCompany && this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([organizationFaker.toJson()]);
    }

    getOrganizationById(organizationId: number): Organization{
        const jsonData = this.file.getFileAsJson();
        return jsonData.find((json: any) => json.id === organizationId);
    }

    getOrganizationAdmin(organizationId: number): User{
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.id === organizationId);

        return User.fromJson(organization.admin);
    }

    getOrganizationByUserId(userId: number): Organization {
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.users.some((user: any) => user.id === userId));
        return Organization.fromJson(organization);
    }

    addUser(organizationId: number, user: User){
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.id === organizationId);

        organization.users.push(user);

        this.file.saveJsonAsFile(jsonData);
    }
}

export default OrganizationModule;