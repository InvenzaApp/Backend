import FileManager from "../../../../../managers/file-manager";
import { GroupJson } from "../../../models/group-json";
import { GroupRepository } from "../../../repository/group-repository";

const file = new FileManager("database", "groups");

GroupRepository.prototype.deleteUserFromGroups = function(
    userId: number
): boolean {
    const jsonData: GroupJson[] = file.getFileAsJson();

    jsonData.forEach((groupJson) => {
        groupJson.usersIdList = groupJson.usersIdList.filter((id) => id !== userId);
    });

    file.saveJsonAsFile(jsonData);

    return true;
}