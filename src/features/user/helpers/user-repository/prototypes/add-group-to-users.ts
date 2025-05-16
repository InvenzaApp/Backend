import FileManager from "../../../../../managers/file-manager";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.addGroupToUsers = function (
    groupId: number,
    usersIdList: number[]
): boolean {
    const jsonData: UserJson[] = file.getFileAsJson();

    usersIdList.forEach((userId) => {
        const userJson: UserJson | undefined = jsonData.find((item: any) => item.id === userId);
        if (userJson) userJson.groupsIdList.push(groupId);
    });

    file.saveJsonAsFile(jsonData);

    return true;
}