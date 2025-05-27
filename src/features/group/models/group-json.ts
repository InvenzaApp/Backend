import { UserJson } from "../../user/models/user-json";

export type GroupJson = {
    id: number;
    title: string;
    usersIdList: number[];
    usersList: UserJson[] | null;
    organizationsIdList: number[],
    locked: boolean;
}