import hashPassword from "../../../../../helpers/hash-password";
import FileManager from "../../../../../managers/file-manager";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.updatePassword = function (
    userId: number,
    oldPassword: string,
    newPassword: string
): boolean {
    const jsonData: UserJson[] = file.getFileAsJson();
    const userJson: UserJson | undefined = jsonData.find((item) => item.id === userId);

    if (!userJson) return false;

    if (hashPassword(oldPassword) != userJson.password) {
        return false;
    }

    userJson.password = hashPassword(newPassword);

    file.saveJsonAsFile(jsonData);

    return true;
}