import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import FileManager from "../../../managers/file-manager";
import { User } from "../../user/models/user";
import { Group } from "../models/group";
import { GroupJson } from "../models/group-json";
import IdGetter from "../../../helpers/id-getter";
import { GroupCreatePayload } from "../payload/group-create-payload";
import { GroupUpdatePayload } from "../payload/group-update-payload";
import { UserRepository } from "../../user/repository/user-repository";

export class GroupRepository extends CockpitRepository<Group> {
    private file: FileManager;
    private userRepository: UserRepository;

    constructor() {
        super();
        this.file = new FileManager("database", "groups")
        this.userRepository = new UserRepository();

        this.file.initializeFile();
    }

    add(payload: GroupCreatePayload): Group | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newGroup = new Group({
            id: newId,
            title: payload.title,
            usersIdList: payload.usersIdList,
            usersList: null,
            locked: payload.locked,
        });

        jsonData.push(newGroup.toJson());

        const success = this.userRepository.addGroupToUsers(newId, payload.usersIdList);

        this.file.saveJsonAsFile(jsonData);

        return success ? newGroup : null;
    }

    get(resourceId: number): Group | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id == resourceId);

        if (!groupJson) return null;

        const group = Group.fromJson(groupJson);

        if (!group) return null;

        const tmpList: User[] = [];

        group.usersIdList.forEach((userId: number) => {
            const user = this.userRepository.get(userId);

            if (user != null) tmpList.push(user);
        });

        group.usersList = tmpList;

        return group;
    }

    getAll(resourceId: number): Group[] | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const filteredData: GroupJson[] = jsonData.filter((groupJson) => {
            return groupJson.usersIdList.some((item) => item === resourceId);
        });

        const groupsList: Group[] = filteredData.flatMap((item) => {
            const group = Group.fromJson(item);

            if (!group) return [];

            const usersList: User[] = this.userRepository.getUsersById(group.usersIdList);

            group.usersList = usersList;

            return group;
        });

        return groupsList;
    }

    update(payload: GroupUpdatePayload): number | null {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonData.find((item) => item.id == payload.id);

        if (!groupJson) return null;

        groupJson.title = payload.title;
        groupJson.usersIdList = payload.usersIdList;

        if (payload.locked != null) {
            groupJson.locked = payload.locked;
        }

        this.file.saveJsonAsFile(jsonData);

        return payload.id;
    }

    delete(resourceId: number): boolean {
        const jsonData: GroupJson[] = this.file.getFileAsJson();

        const filteredData: GroupJson[] = jsonData.filter((item) => item.id !== resourceId);

        this.file.saveJsonAsFile(filteredData);

        const success = this.userRepository.deleteGroupFromUsers(resourceId);

        return success;
    }
}