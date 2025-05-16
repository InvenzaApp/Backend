import { CreatePayload } from "../../../core/repository/models/payload/create-payload";
import { TaskComment } from "../../comments/models/comment";
import { Group } from "../../group/models/group";
import { User } from "../../user/models/user";

export interface TaskCreatePayload extends CreatePayload{
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    groupsList: Group[] | null;
    createdAt: string;
    createdBy: User;
    status: string;
    locked: boolean;
    comments: TaskComment[];
    commentsEnabled: boolean;
}