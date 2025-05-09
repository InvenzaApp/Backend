import { defaultOrganization } from "../fakers/organization";
import FileManager from "../managers/file-manager";
import {Organization} from "../models/organization";

import {User} from "../models/user";
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

    getOrganizationById(organizationId: number): Organization{
        const jsonData = this.file.getFileAsJson();
        const foundJsonOrganization = jsonData.find((json: any) => json.id === organizationId);
        return Organization.fromJson(foundJsonOrganization);
    }

    getOrganizationAdmin(organizationId: number): User{
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.id === organizationId);

        return this.userModule.getUserById(organization.adminId);
    }

    getOrganizationByUserId(userId: number): Organization {
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.usersIdList.some((user: any) => user === userId));
        return Organization.fromJson(organization);
    }

    addUser(organizationId: number, user: User){
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((json: any) => json.id === organizationId);

        organization.usersIdList.push(user.id);

        this.file.saveJsonAsFile(jsonData);
    }

    deleteUser(organizationId: number, userId: number) {
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((item: any) => item.id === organizationId);

        if (organization) {
            organization.usersIdList = organization.usersIdList.filter((id: number) => id !== userId);
        }

        this.file.saveJsonAsFile(jsonData);
    }

    updateOrganization(organizationId: number, title: string, street: string, buildingNumber: string, apartmentNumber: string,
        postCode: string, city: string, country: string
    ): boolean{
        const jsonData = this.file.getFileAsJson();
        const organization = jsonData.find((item: any) => item.id === organizationId);

        if(!organization) return false;

        organization.title = title;
        organization.address.street = street;
        organization.address.buildingNumber = buildingNumber;
        organization.address.apartmentNumber = apartmentNumber ?? null;
        organization.address.postCode = postCode;
        organization.address.city = city;
        organization.address.country = country;

        this.file.saveJsonAsFile(jsonData);
        return true;
    }
}

export default OrganizationModule;