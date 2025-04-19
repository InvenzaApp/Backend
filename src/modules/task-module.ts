import FileManager from "../managers/file-manager";
import {Task} from "../models/task";
import IdGetter from "../helpers/id-getter";
import {GroupModule} from "./group-module";
import {Group} from "../models/group";
import {taskFaker} from "../fakers/task";
import {User} from "../models/user";
import {DateTime} from "../helpers/date-time";

export class TaskModule {
    file = new FileManager("database", "tasks");
    groupModule = new GroupModule();

    constructor(createDefaultTasks: boolean = false) {
        this.file.initializeFile();

        if (createDefaultTasks && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile() {
        this.file.saveJsonAsFile([taskFaker.toJson()]);
    }

    addTask(title: string, description: string | null, deadline: string | null, groupsIdList: number[], createdBy: User): number {
        const jsonData = this.file.getFileAsJson();
        const newId = IdGetter(jsonData);

        const newTask = new Task(newId, title, description, deadline, groupsIdList, DateTime.getFullTimestamp(), createdBy);

        jsonData.push(newTask.toJson());

        this.file.saveJsonAsFile(jsonData);
        return newId;
    }

    updateTask(id: number, title: string, description: string | null, deadline: string | null, groupsIdList: number[]): number {
        const jsonData = this.file.getFileAsJson();
        const task = jsonData.find((item: any) => item.id === id);

        if (!task) {
            return id;
        }

        task.title = title;
        task.description = description;
        task.deadline = deadline;
        task.groupsIdList = groupsIdList;

        this.file.saveJsonAsFile(jsonData);

        return id;
    }

    getTasks() {
        return this.file.getFileAsJson();
    }

    getTask(resourceId: number): Task {
        const jsonData = this.file.getFileAsJson();
        const task = jsonData.find((item: any) => item.id === resourceId);

        const groupsIdList = task.groupsIdList;

        let tmpList: Group[] = [];

        groupsIdList.forEach((group: any) => {
            const item = this.groupModule.getGroup(group);
            tmpList.push(item);
        })

        task.groupsList = tmpList;

        return task;
    }

    deleteTask(resourceId: number) {
        const jsonData = this.file.getFileAsJson();
        const newData = jsonData.filter((item: any) => item.id !== resourceId);
        this.file.saveJsonAsFile(newData);
    }

    removeGroupFromTasks(groupId: number) {
        const tasksList = this.file.getFileAsJson();

        tasksList.filter((item: any) => item.groupsIdList.includes(groupId)).forEach((task: any) => {
            const groupsList = task.groupsIdList;
            task.groupsIdList = groupsList.filter((groupItem: any) => groupItem !== groupId);
        });

        this.file.saveJsonAsFile(tasksList);
    }
}