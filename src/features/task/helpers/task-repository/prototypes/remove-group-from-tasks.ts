import FileManager from "../../../../../managers/file-manager";
import { TaskJson } from "../../../models/task-json";
import { TaskRepository } from "../../../repository/task-repository";

const file = new FileManager("database", "tasks");

TaskRepository.prototype.removeGroupFromTasks = (
    groupId: number
): boolean => {
    const tasksList: TaskJson[] = file.getFileAsJson();

    tasksList
        .filter((item) => item.groupsIdList.includes(groupId))
        .forEach((item) => {
            const groupsList: number[] = item.groupsIdList;
            item.groupsIdList = groupsList.filter((group) => group !== groupId);
        });

    file.saveJsonAsFile(tasksList);

    return true;
}