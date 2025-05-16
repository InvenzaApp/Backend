import { GroupJson } from "../../group/models/group-json";

export type UserJson = {
    id: number;
    name: string;
    lastname: string;
    title: string;
    email: string;
    password: string;
    organizationId: number;
    groupsIdList: number[];
    groups: GroupJson[] | null;
    permissions: string[];
    admin: boolean;
    locked: boolean;
}