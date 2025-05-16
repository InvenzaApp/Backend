import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../../user/models/user";
import { OrganizationJson } from "../../../models/organization-json";
import { OrganizationRepository } from "../../../repository/organization-repository";

const file = new FileManager("database", "organization");

OrganizationRepository.prototype.addUser = function (
    organizationId: number,
    user: User
): boolean {
    const jsonData: OrganizationJson[] = file.getFileAsJson();

    const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

    if (!organizationJson) return false;

    organizationJson.usersIdList.push(user.id);

    file.saveJsonAsFile(jsonData);

    return true;
}