import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../../user/models/user";
import { OrganizationJson } from "../../../models/organization-json";
import { OrganizationRepository } from "../../../repository/organization-repository";

const file = new FileManager("database", "organization");

OrganizationRepository.prototype.updateUser = function (
    organizationsIdList: number[],
    userId: number
): boolean {
    const jsonData: OrganizationJson[] = file.getFileAsJson(); // [0, 1, 2]
    var organiaztionsToDelete: OrganizationJson[] = []; // [0, 1]
    var organizationsToAdd: OrganizationJson[] = []; // [0, 1]
    // var organizationsIdList = [1, 2];


    jsonData.forEach((json) => {
        if(organizationsIdList.includes(json.id)){
            organizationsToAdd.push(json);
        }else{
            organiaztionsToDelete.push(json);
        }
    })

    organizationsToAdd.forEach((json) => {
        if(!json.usersIdList.includes(userId)){
            jsonData.find((item) => item.id === json.id)?.usersIdList.push(userId);
        }
    })

    organiaztionsToDelete.forEach((json) => {
        const filteredData = json.usersIdList.filter((item) => item !== userId);
        const organization = jsonData.find((item) => item.id === json.id);

        if(organization == null) return;

        organization.usersIdList = filteredData;
    })

    // organizationsIdList.forEach((organizationId) => {
    //     const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

    //     if (!organizationJson) return false;

    //     organizationJson.usersIdList.push(user.id);
    // })

    file.saveJsonAsFile(jsonData);

    return true;
}