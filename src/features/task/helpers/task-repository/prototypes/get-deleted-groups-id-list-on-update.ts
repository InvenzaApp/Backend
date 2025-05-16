import FileManager from "../../../../../managers/file-manager";
import { Task } from "../../../models/task";
import { TaskJson } from "../../../models/task-json";
import { TaskRepository } from "../../../repository/task-repository";

const file = new FileManager("database", "tasks");

TaskRepository.prototype.getDeletedGroupsIdListOnUpdate = (
    newGroupsIdList: number[],
    taskId: number,
): number[] | null => {
    const jsonData: TaskJson[] = file.getFileAsJson();

    const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

    if (!taskJson) return null;

    const task = Task.fromJson(taskJson);

    if (!task) return null;

    const groupsIdList = task.groupsIdList;

    var tmpList: number[] = [];

    groupsIdList.forEach((groupId) => {
        if (!newGroupsIdList.includes(groupId)) {
            tmpList.push(groupId);
        }
    });

    return tmpList;
}