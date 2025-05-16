import { User } from "../../models/user";
import { UserRepository } from "../../repository/user-repository";

declare module "../../repository/user-repository" {
    interface UserRepository {
        signIn(
            email: string,
            password: string
        ): User | null;

        getUsersById(
            idList: number[]
        ): User[];

        deleteGroupFromUsers(
            groupId: number
        ): boolean;

        updatePassword(
            userId: number,
            oldPassword: string,
            newPassword: string
        ): boolean;

        addGroupToUsers(
            groupId: number,
            usersIdList: number[]
        ): boolean;

        updateUserGroups(
            usersIdList: number[],
            groupId: number
        ): boolean;

        updateSelfAccount(
            userId: number,
            name: string,
            lastname: string,
            email: string
        ): boolean;
    }
}