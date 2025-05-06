import FileManager from "../managers/file-manager";
import {Task} from "../models/task";
import IdGetter from "../helpers/id-getter";
import {GroupModule} from "./group-module";
import {Group} from "../models/group";
import {taskFaker1, taskFaker2, taskFaker3, taskFaker4, taskFaker5, taskFaker6} from "../fakers/task";
import {User} from "../models/user";
import {DateTime} from "../helpers/date-time";
import OrganizationModule from "./organization-module";
import UserModule from "./user-module";
import { isOnlyWhitespace } from "../helpers/whitespace";

export class TaskModule {
    file = new FileManager("database", "tasks");
    groupModule = new GroupModule();
    organizationModule = new OrganizationModule();
    userModule = new UserModule();

    constructor(createDefaultTasks: boolean = false) {
        this.file.initializeFile();

        if (createDefaultTasks && this.file.isEmpty()) {
            this.initializeFile();
        }
    }

    private initializeFile() {
        this.file.saveJsonAsFile([
            taskFaker1,
            taskFaker2,
            taskFaker3,
            taskFaker4,
            taskFaker5,
            taskFaker6,
        ]);
    }

    addTask(title: string, description: string | null, deadline: string | null, groupsIdList: number[], createdBy: User): number {
        const jsonData = this.file.getFileAsJson();
        const newId = IdGetter(jsonData);

        const newTask = new Task(newId, title, description, deadline, groupsIdList, DateTime.getFullTimestamp(), createdBy, "toDo");

        if(description == null || isOnlyWhitespace(description)){
            newTask.description = null;
        }

        jsonData.push(newTask.toJson());

        this.file.saveJsonAsFile(jsonData);
        return newId;
    }

    updateTask(id: number, title: string, description: string | null, deadline: string | null, groupsIdList: number[], status: string): number {
        const jsonData = this.file.getFileAsJson();
        const task = jsonData.find((item: any) => item.id === id);

        if (!task) {
            return id;
        }

        task.title = title;
        task.description = description;
        task.deadline = deadline; 
        task.groupsIdList = groupsIdList;
        task.status = status;

        if(isOnlyWhitespace(description ?? '')){
            task.description = null;
        }

        this.file.saveJsonAsFile(jsonData);

        return id;
    }

    getDeletedGroupsIdListOnUpdate(newGroupsIdList: number[], taskId: number): number[]{
        const jsonData = this.file.getFileAsJson();

        const foundTask = jsonData.find((task: any) => task.id === taskId);

        if(!foundTask) return [];

        const groupsIdList = foundTask.groupsIdList;
        var tmpList: number[] = [];

        groupsIdList.forEach((groupId: number) => {
            if(!newGroupsIdList.includes(groupId)){
                tmpList.push(groupId);
            }
        });

        return tmpList;
    }

    getAddedGroupsIdListOnUpdate(newGroupsIdList: number[], taskId: number): number[]{
        const jsonData = this.file.getFileAsJson();

        const foundTask = jsonData.find((task: any) => task.id === taskId);

        if(!foundTask) return [];

        const groupsIdList = foundTask.groupsIdList;
        var tmpList: number[] = [];

        newGroupsIdList.forEach((groupId: number) => {
            if(!groupsIdList.includes(groupId)){
                tmpList.push(groupId);
            }
        });

        return tmpList;
    }

    getTasks(userId: number): Task[] {
        const jsonData = this.file.getFileAsJson();
        const groups = this.groupModule.getGroups(userId);
        const organization = this.organizationModule.getOrganizationByUserId(userId);
        const admin = this.organizationModule.getOrganizationAdmin(organization.id);
        const isAdmin = admin.id === userId;

        const groupsId = groups.map(group => group.id);

        const filteredData =  jsonData
            .filter((group: any) => group.groupsIdList.some((item: any) => groupsId.includes(item))).map((task: any) => Task.fromJson(task));

        if(!isAdmin){
            return filteredData;
        }

        const unassignedTasks = jsonData.filter((task: any) => Array.isArray(task.groupsIdList) && task.groupsIdList.length === 0)
            .map((task: any) => Task.fromJson(task));

        return [...unassignedTasks, ...filteredData];
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
        task.createdBy = this.userModule.getUserById(task.createdById);

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