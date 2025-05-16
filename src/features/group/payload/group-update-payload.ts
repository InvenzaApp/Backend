import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";
import { User } from "../../user/models/user";

export interface GroupUpdatePayload extends UpdatePayload {
    id: number;
    title: string;
    usersIdList: number[];
    usersList: User[] | null;
    locked: boolean | null;
}