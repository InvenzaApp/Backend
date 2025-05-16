import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../models/user";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.getUsersById = function (
    idList: number[]
): User[] {
    const jsonData: UserJson[] = file.getFileAsJson();

    return jsonData
        .filter((item) => idList.includes(item.id))
        .map((item) => User.fromJson(item));
}