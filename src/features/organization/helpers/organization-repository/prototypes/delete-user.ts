import FileManager from "../../../../../managers/file-manager";
import { OrganizationJson } from "../../../models/organization-json";
import { OrganizationRepository } from "../../../repository/organization-repository";

const file = new FileManager("database", "organization");

OrganizationRepository.prototype.deleteUser = function (
    organizationId: number,
    userId: number
): boolean {
    const jsonData: OrganizationJson[] = file.getFileAsJson();
    const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

    if (!organizationJson) return false;

    organizationJson.usersIdList = organizationJson.usersIdList.filter((item) => item !== userId);

    file.saveJsonAsFile(jsonData);

    return true;
}