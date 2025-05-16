import FileManager from "../../../../../managers/file-manager";
import { GroupJson } from "../../../models/group-json";
import { GroupRepository } from "../../../repository/group-repository";

const file = new FileManager("database", "groups");

GroupRepository.prototype.updateUserGroups = function(
    userId: number,
    groupsIdList: number[]
): boolean {
    const jsonData: GroupJson[] = file.getFileAsJson();

    jsonData.forEach((groupJson) => {
        if (groupsIdList.includes(groupJson.id)) {
            if (!groupJson.usersIdList.includes(userId)) {
                groupJson.usersIdList.push(userId);
            }
        } else {
            if (groupJson.usersIdList.includes(userId)) {
                groupJson.usersIdList = groupJson.usersIdList.filter((item) => item != userId);
            }
        }
    });

    file.saveJsonAsFile(jsonData);

    return true;
}