import FileManager from "../managers/file-manager";
import {Task} from "../models/task";
import IdGetter from "../helpers/id-getter";
import {GroupModule} from "./group-module";
import {Group} from "../models/group";

export class TaskModule{
    file = new FileManager("database", "tasks");
    groupModule = new GroupModule();

    constructor(createDefaultTasks: boolean = false) {
        this.file.initializeFile();

        if(createDefaultTasks && this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile() {
        const defaultTask = new Task(
            0,
            "Ukończyć aplikacje",
            "Dokończyć aplikację w najbliższym czasie",
            null,
            [0]
        );

        this.file.saveJsonAsFile([defaultTask.toJson()]);
    }

    addTask(title: string, description: string|null, deadline: string|null, groupsIdList: number[]): number{
        const jsonData = this.file.getFileAsJson();
        const newId = IdGetter(jsonData);

        const newTask = new Task(newId, title, description, deadline, groupsIdList);

        jsonData.push(newTask.toJson());

        this.file.saveJsonAsFile(jsonData);
        return newId;
    }

    updateTask(id: number, title: string, description: string|null, deadline: string|null, groupsIdList: number[]): number{
        const jsonData = this.file.getFileAsJson();
        const task = jsonData.find((item: any) => item.id === id);

        if(!task){
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

    getTask(resourceId: number): Task{
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
}