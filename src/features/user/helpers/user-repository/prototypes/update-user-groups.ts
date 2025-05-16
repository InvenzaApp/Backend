import FileManager from "../../../../../managers/file-manager";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.updateUserGroups = function (
    usersIdList: number[],
    groupId: number
): boolean {
    const jsonData: UserJson[] = file.getFileAsJson();

    jsonData.forEach((item) => {
        if (usersIdList.includes(item.id)) {
            if (!item.groupsIdList.includes(groupId)) {
                item.groupsIdList.push(groupId);
            }
        } else {
            if (item.groupsIdList.includes(groupId)) {
                item.groupsIdList = item.groupsIdList.filter((itemId) => itemId != groupId);
            }
        }
    });

    file.saveJsonAsFile(jsonData);

    return true;
}