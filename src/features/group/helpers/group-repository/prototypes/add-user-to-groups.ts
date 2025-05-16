import FileManager from "../../../../../managers/file-manager";
import { Group } from "../../../models/group";
import { GroupJson } from "../../../models/group-json";
import { GroupRepository } from "../../../repository/group-repository";

const file = new FileManager("database", "groups");

GroupRepository.prototype.addUserToGroups = function(
    userId: number,
    groupsIdList: number[]
): boolean {
    const jsonData: GroupJson[] = file.getFileAsJson();

    (groupsIdList ?? []).forEach((groupId) => {
        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id === groupId);

        if (!groupJson) return;

        const group = Group.fromJson(groupJson);

        if (group) group.usersIdList.push(userId);
    });

    file.saveJsonAsFile(jsonData);

    return true;
}