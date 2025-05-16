import { GroupRepository } from "../../repository/group-repository";

declare module "../../repository/group-repository" {
    interface GroupRepository {
        getRemovedUsersIdListOnUpdate(
            newUsersIdList: number[],
            groupId: number
        ): number[];

        getAddedUsersIdListOnUpdate(
            newUsersIdList: number[],
            groupId: number
        ): number[];

        getGroupNameById(id: number): string | null;

        addUserToGroups(userId: number, groupsIdList: number[]): boolean;

        deleteUserFromGroups(userId: number): boolean;

        updateUserGroups(userId: number, groupsIdList: number[]): boolean;
    }
}
