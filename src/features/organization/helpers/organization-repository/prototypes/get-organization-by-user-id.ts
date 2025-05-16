import FileManager from "../../../../../managers/file-manager";
import { Organization } from "../../../models/organization";
import { OrganizationJson } from "../../../models/organization-json";
import { OrganizationRepository } from "../../../repository/organization-repository";

const file = new FileManager("database", "organization");

OrganizationRepository.prototype.getOrganizationByUserId = function (
    userId: number
): Organization | null {
    const jsonData: OrganizationJson[] = file.getFileAsJson();

    const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.usersIdList.some((user) => user === userId));

    if (!organizationJson) return null;

    return Organization.fromJson(organizationJson);
}