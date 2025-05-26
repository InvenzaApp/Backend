import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";
import FileManager from "../../../managers/file-manager";
import { Organization } from "../models/organization";
import { OrganizationJson } from "../models/organization-json";
import { OrganizationUpdatePayload } from "../payload/organization-update-payload";
import IdGetter from "../../../helpers/id-getter";
import { OrganizationCreatePayload } from "../payload/organization-create-payload";
import { defaultOrganizationModel } from "../../../database-models/organization";

export class OrganizationRepository extends CockpitRepository<Organization> {
    private file: FileManager;

    constructor() {
        super();

        this.file = new FileManager("database", "organization");

        this.file.initializeFile();

        if(this.file.isEmpty()){
             this.file.saveJsonAsFile([defaultOrganizationModel]);
        }
    }

    add(payload: OrganizationCreatePayload): Organization | null {
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();
        
        const newId = IdGetter(jsonData);

        const newOrganization = new Organization({
            id: newId,
            title: payload.title,
            users: payload.users,
            admin: payload.admin,
            address: payload.address,
            locked: payload.locked
        })

        jsonData.push(newOrganization.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newOrganization;
    }

    get(resourceId: number): Organization | null {
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();

        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === resourceId);

        if (!organizationJson) return null;

        return Organization.fromJson(organizationJson);
    }

    getAll(resourceId: number): Organization[] | null {
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();
        const filteredData: OrganizationJson[] | null = jsonData.filter((org) => org.usersIdList.includes(resourceId));

        if(filteredData == null) return null;

        return filteredData.flatMap((item) => {
            const organization = Organization.fromJson(item);

            if(organization == null) return [];

            return organization;
        });
    }

    update(payload: OrganizationUpdatePayload): number | null {
        const jsonData: OrganizationJson[] = this.file.getFileAsJson();
        const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === payload.organizationId);

        if(!organizationJson) return null;

        organizationJson.title = payload.title;
        organizationJson.address.street = payload.street;
        organizationJson.address.buildingNumber = payload.buildingNumber;
        organizationJson.address.apartmentNumber = payload.apartmentNumber ?? null;
        organizationJson.address.postCode = payload.postCode;
        organizationJson.address.city = payload.city;
        organizationJson.address.country = payload.country;

        if(payload.locked != null){
            organizationJson.locked = payload.locked;
        }

        this.file.saveJsonAsFile(jsonData);
        
        return payload.organizationId;
    }

    delete(resourceId: number): boolean {
        throw new Error("Method not implemented.");
    }
}