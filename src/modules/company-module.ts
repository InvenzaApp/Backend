import FileManager from "../managers/file-manager";
import {Organization} from "../models/organization";

class CompanyModule {
    file = new FileManager("database", "company");

    constructor(createDefaultCompany: boolean = false) {
        this.file.initializeFile();

        if(createDefaultCompany && this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        const defaultCompany = new Organization(0, "Invenza");

        this.file.saveJsonAsFile([defaultCompany.toJson()]);
    }
}

export default CompanyModule;