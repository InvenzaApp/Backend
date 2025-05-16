import FileManager from "../../../../../managers/file-manager";
import { GroupJson } from "../../../models/group-json";
import { GroupRepository } from "../../../repository/group-repository";

const file = new FileManager("database", "groups");

GroupRepository.prototype.getRemovedUsersIdListOnUpdate = function(
    newUsersIdList: number[],
    groupId: number
): number[] {
    const jsonData: GroupJson[] = file.getFileAsJson();

    const foundGroup: GroupJson | undefined = jsonData.find((group) => group.id === groupId);

    if (!foundGroup) return [];

    const usersIdList: number[] = foundGroup.usersIdList;

    var tmpList: number[] = [];

    usersIdList.forEach((userId) => {
        if (!newUsersIdList.includes(userId)) {
            tmpList.push(userId);
        }
    });

    return tmpList;
}