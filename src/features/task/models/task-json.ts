import { TaskCommentJson } from "../../comments/models/comment-json";
import { GroupJson } from "../../group/models/group-json";

export type TaskJson = {
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    groupsIdList: number[];
    groupsList: GroupJson[] | null;
    createdAt: string;
    createdById: number;
    status: string;
    locked: boolean;
    comments: TaskCommentJson[];
    commentsEnabled: boolean;
}