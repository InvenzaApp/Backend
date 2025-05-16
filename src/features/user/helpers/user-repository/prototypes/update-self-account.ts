import FileManager from "../../../../../managers/file-manager";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.updateSelfAccount = function (
    userId: number,
    name: string,
    lastname: string,
    email: string
): boolean {
    const jsonData: UserJson[] = file.getFileAsJson();

    const userJson: UserJson | undefined = jsonData.find((user: any) => user.id === userId);

    if (!userJson) return false;

    const existingUserJson: UserJson | undefined = jsonData.find((user: any) => user.email === email);

    if (existingUserJson && existingUserJson.id !== userId) {
        return false;
    }

    userJson.name = name;
    userJson.lastname = lastname;
    userJson.title = `${name} ${lastname}`;
    userJson.email = email;

    file.saveJsonAsFile(jsonData);

    return true;
}