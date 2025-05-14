import FileManager from "../managers/file-manager";
import { Task, TaskJson } from "../models/task";
import IdGetter from "../helpers/id-getter";
import { GroupModule } from "./group-module";
import { Group } from "../models/group";
import { User } from "../models/user";
import { DateTime } from "../helpers/date-time";
import OrganizationModule from "./organization-module";
import UserModule from "./user-module";
import { isOnlyWhitespace } from "../helpers/whitespace";
import { TaskComment, TaskCommentJson } from "../models/comment";
import { Organization } from "../models/organization";

export class TaskModule {
    file = new FileManager("database", "tasks");
    groupModule = new GroupModule();
    organizationModule = new OrganizationModule();
    userModule = new UserModule();

    constructor() {
        this.file.initializeFile();
    }

    addTask(
        title: string, 
        description: string | null, 
        deadline: string | null, 
        groupsIdList: number[], 
        createdBy: User, 
        locked: boolean,
        commentsEnabled: boolean,
    ): Task | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newTask = new Task({
            id: newId, 
            title: title, 
            description: description, 
            deadline: deadline, 
            groupsIdList: groupsIdList, 
            groupsList: null,
            createdAt: DateTime.getFullTimestamp(), 
            createdBy: createdBy, 
            status: "toDo", 
            locked: locked ?? false,
            comments: [],
            commentsEnabled: commentsEnabled,
        });

        if(description == null || isOnlyWhitespace(description)){
            newTask.description = null;
        }

        const taskJson = newTask.toJson();

        if(!taskJson) return null;

        jsonData.push(taskJson);

        this.file.saveJsonAsFile(jsonData);

        return newTask;
    }

    updateTask(
        taskId: number, 
        title: string, 
        description: string | null, 
        deadline: string | null, 
        groupsIdList: number[], 
        status: string, 
        locked: boolean | null,
        commentsEnabled: boolean,
    ): number | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

        if (!taskJson) return null;
    
        taskJson.title = title;
        taskJson.description = description;
        taskJson.deadline = deadline; 
        taskJson.groupsIdList = groupsIdList;
        taskJson.status = status;
        taskJson.commentsEnabled = commentsEnabled;

        if(locked != null){
            taskJson.locked = locked;
        }

        if(isOnlyWhitespace(description ?? '')){
            taskJson.description = null;
        }

        this.file.saveJsonAsFile(jsonData);

        return taskId;
    }

    getDeletedGroupsIdListOnUpdate(
        newGroupsIdList: number[], 
        taskId: number
    ): number[] | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

        if(!taskJson) return null;

        const task = Task.fromJson(taskJson);

        if(!task) return null;

        const groupsIdList = task.groupsIdList;

        var tmpList: number[] = [];

        groupsIdList.forEach((groupId) => {
            if(!newGroupsIdList.includes(groupId)){
                tmpList.push(groupId);
            }
        });

        return tmpList;
    }

    getAddedGroupsIdListOnUpdate(
        newGroupsIdList: number[], 
        taskId: number
    ): number[] | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

        if(!taskJson) return null;

        const task = Task.fromJson(taskJson);

        if(!task) return null;

        const groupsIdList = task.groupsIdList
        ;
        var tmpList: number[] = [];

        newGroupsIdList.forEach((groupId) => {
            if(!groupsIdList.includes(groupId)){
                tmpList.push(groupId);
            }
        });

        return tmpList;
    }

    getTasks(userId: number): Task[] | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const groups: Group[] = this.groupModule.getGroups(userId);

        const organization: Organization | null = this.organizationModule.getOrganizationByUserId(userId);
        if(!organization) return null;

        const isAdmin: boolean = organization.admin.id === userId;

        const groupsIdList: number[] = groups.map(group => group.id);

        const filteredData: Task[] = jsonData
            .filter((task) => {
                return task.groupsIdList.some((item) => {
                    return groupsIdList.includes(item);
                });
            })
            .flatMap((item: any) => {
                const task = Task.fromJson(item);

                if(!task) return [];

                return task;
            });

        if(!isAdmin){
            return filteredData;
        }

        const unassignedTasks: Task[] = jsonData
        .filter((task) => {
            return Array.isArray(task.groupsIdList) && task.groupsIdList.length === 0;
        })
        .flatMap((item: any) => {
            const task = Task.fromJson(item);

            if(!task) return [];

            return task;
        });

        return [...unassignedTasks, ...filteredData];
    }

    getTask(resourceId: number): Task | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === resourceId);
        
        if(!taskJson) return null;

        const task: Task | null = Task.fromJson(taskJson);

        if(!task) return null;

        const groupsIdList: number[] = task.groupsIdList;

        let tmpList: Group[] = [];

        groupsIdList.forEach((item) => {
            const group = this.groupModule.getGroup(item);

            if(group) tmpList.push(group);
        })

        task.groupsList = tmpList;

        return task;
    }

    deleteTask(resourceId: number): boolean{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const filteredData: TaskJson[] | undefined = jsonData.filter((item) => item.id !== resourceId);

        if(!filteredData) return false;

        this.file.saveJsonAsFile(filteredData);

        return true;
    }

    removeGroupFromTasks(groupId: number): boolean{
        const tasksList: TaskJson[] = this.file.getFileAsJson();

        tasksList
        .filter((item) => item.groupsIdList.includes(groupId))
        .forEach((item) => {
            const groupsList: number[] = item.groupsIdList;
            item.groupsIdList = groupsList.filter((group) => group !== groupId);
        });

        this.file.saveJsonAsFile(tasksList);

        return true;
    }

    getComments(taskId: number): TaskComment[] | null{
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const taskJson: TaskJson | undefined = jsonData.find((item: any) => item.id === taskId);

        if(!taskJson) return null;

        const commentsList: TaskComment[] = taskJson.comments.flatMap((item) => {
            const comment: TaskComment | null = TaskComment.fromJson(item);

            if(!comment) return [];

            return comment;
        });

        return commentsList;
    }

    addComment(taskId: number, userId: number, title: string): boolean{    
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

        if(!taskJson) return false;

        const taskCommentId: number = IdGetter(taskJson.comments);

        const comment = new TaskComment({
            id: taskCommentId,
            userId: userId,
            title: title,
            publishDate: DateTime.getFullTimestamp(),
            deleted: false,
            author: null,
        });

        taskJson.comments.push(comment.toJson());

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    deleteComment(taskId: number, commentId: number): boolean{
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === taskId);

        if(!taskJson) return false;

        const comment = taskJson.comments.find((item: any) => item.id === commentId);

        if(!comment) return false;

        comment.deleted = true;

        this.file.saveJsonAsFile(jsonData);

        return true;
    }
}