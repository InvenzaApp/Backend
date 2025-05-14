import { defaultOrganization } from "../fakers/organization";
import FileManager from "../managers/file-manager";
import { Organization, OrganizationJson } from "../models/organization";

import { User } from "../models/user";
import UserModule from "./user-module";

class OrganizationModule {
    file = new FileManager("database", "organization");
    userModule = new UserModule();

    constructor() {
        this.file.initializeFile();

        if(this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([defaultOrganization]);
    }

    getOrganizationById(organizationId: number): Organization | null{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();

        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

        if(!organizationJson) return null;

        return Organization.fromJson(organizationJson);
    }

    getOrganizationAdmin(organizationId: number): User | null{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();

        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

        if(!organizationJson) return null;

        const organization: Organization | null = Organization.fromJson(organizationJson);

        if(!organization) return null;

        return organization.admin;
    }

    getOrganizationByUserId(userId: number): Organization | null{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();

        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.usersIdList.some((user) => user === userId));

        if(!organizationJson) return null;

        return Organization.fromJson(organizationJson);
    }

    addUser(
        organizationId: number, 
        user: User
    ): boolean{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();

        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

        if(!organizationJson) return false;

        organizationJson.usersIdList.push(user.id);

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    deleteUser(
        organizationId: number, 
        userId: number
    ): boolean{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();
        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

        if(!organizationJson) return false;

        organizationJson.usersIdList = organizationJson.usersIdList.filter((item) => item !== userId);

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    updateOrganization(
        organizationId: number, 
        title: string, 
        street: string, 
        buildingNumber: string, 
        apartmentNumber: string,
        postCode: string, 
        city: string, 
        country: string, 
        locked: boolean | null
    ): boolean{
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();
        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

        if(!organizationJson) return false;

        organizationJson.title = title;
        organizationJson.address.street = street;
        organizationJson.address.buildingNumber = buildingNumber;
        organizationJson.address.apartmentNumber = apartmentNumber ?? null;
        organizationJson.address.postCode = postCode;
        organizationJson.address.city = city;
        organizationJson.address.country = country;

        if(locked != null){
            organizationJson.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);
        
        return true;
    }
}

export default OrganizationModule;