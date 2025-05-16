import { TaskRepository } from "../../repository/task-repository";

declare module "../../repository/task-repository" {
    interface TaskRepository {
        getDeletedGroupsIdListOnUpdate(
            newGroupsIdList: number[],
            taskId: number
        ): number[] | null;

        getAddedGroupsIdListOnUpdate(
            newGroupsIdList: number[],
            taskId: number
        ): number[] | null;

        removeGroupFromTasks(groupId: number): boolean;
    }
}