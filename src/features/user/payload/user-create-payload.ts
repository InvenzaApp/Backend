import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { Group } from "../../group/models/group";

export interface UserCreatePayload extends CreatePayload{
    id: number;
    name: string;
    lastname: string;
    title: string;
    email: string;
    password: string;
    organizationsIdList: number[];
    groupsIdList: number[];
    groups: Group[] | null;
    permissions: string[];
    admin: boolean;
    locked: boolean;
}