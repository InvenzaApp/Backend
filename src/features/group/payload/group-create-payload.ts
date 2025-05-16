import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { User } from "../../user/models/user";

export interface GroupCreatePayload extends CreatePayload{
    id: number;
    title: string;
    usersIdList: number[];
    usersList: User[] | null;
    locked: boolean;
}