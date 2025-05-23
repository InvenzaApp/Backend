import FileManager from "../../../managers/file-manager";
import { Address } from "../../address/models/address";
import { OrganizationJson } from "../../organization/models/organization-json";
import { UserRepository } from "../../user/repository/user-repository";
import { CmsOrganization } from "../models/cms-organization";

export class CmsRepository{
    private organizationFile: FileManager;
    private userRepository: UserRepository;

    constructor(){
        this.organizationFile = new FileManager("database", "organization");
        this.userRepository = new UserRepository();
    }

    getOrganizations(): CmsOrganization[] {
        const jsonData: OrganizationJson[] = this.organizationFile.getFileAsJson();

        var tmpList: CmsOrganization[] = [];

        jsonData.forEach((json) => {
            const admin = this.userRepository.get(json.adminId);

            if(admin == null) return;

            tmpList.push(new CmsOrganization({
                id: json.id,
                title: json.title,
                admin: admin,
                address: Address.fromJson(json.address)
            }))
        });

        return tmpList;
    }
}