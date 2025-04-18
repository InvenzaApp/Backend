import FileManager from "../managers/file-manager";
import {Organization} from "../models/organization";
import {organizationFaker} from "../fakers/organization";

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
}

export default OrganizationModule;