import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";

export interface UserUpdatePayload extends UpdatePayload {
    userId: number;
    name: string;
    lastname: string;
    email: string;
    organizationsIdList: number[];
    groupsIdList: number[] | null;
    permissions: string[] | null;
    admin: boolean | null;
    superadmin: boolean | null;
    locked: boolean | null;
}