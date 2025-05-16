import FileManager from "../../../../../managers/file-manager";
import { Group } from "../../../models/group";
import { GroupJson } from "../../../models/group-json";
import { GroupRepository } from "../../../repository/group-repository";

const file = new FileManager("database", "groups");

GroupRepository.prototype.getGroupNameById = function(
    id: number
): string | null {
    const jsonData: GroupJson[] = file.getFileAsJson();

    const groupJson: GroupJson | undefined = jsonData.find((item) => item.id === id);

    if (!groupJson) return null;

    const group = Group.fromJson(groupJson);

    if (!group) return null;

    return group.title;
}