import hashPassword from "../../../../../helpers/hash-password";
import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../models/user";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.signIn = function (
    email: string,
    password: string
): User | null {
    const jsonData: UserJson[] = file.getFileAsJson();

    const userJson: UserJson | undefined = jsonData.find((item) => {
        return item.email === email && item.password === hashPassword(password);
    });

    if (userJson) {
        const user = User.fromJson(userJson);

        return user;
    } else {
        return null;
    }
}