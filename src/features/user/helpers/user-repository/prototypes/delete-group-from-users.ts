import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../models/user";
import { UserJson } from "../../../models/user-json";
import { UserRepository } from "../../../repository/user-repository";

const file = new FileManager("database", "users");

UserRepository.prototype.deleteGroupFromUsers = function(
    groupId: number
): boolean {
        const jsonData: UserJson[] = file.getFileAsJson();

        const updatedUsers: User[] = jsonData
            .map((item: any) => {
                if (Array.isArray(item.groupsIdList)) {
                    item.groupsIdList = item.groupsIdList.filter((id: number) => id !== groupId);
                }
                return item;
            });

        file.saveJsonAsFile(updatedUsers);

        return true;
    }