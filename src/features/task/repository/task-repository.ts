import FileManager from "../../../managers/file-manager";
import { Task } from "../models/task";
import IdGetter from "../../../helpers/id-getter";
import { Group } from "../../group/models/group";
import { DateTime } from "../../../helpers/date-time";
import { isOnlyWhitespace } from "../../../helpers/whitespace";
import { Organization } from "../../organization/models/organization";
import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import { TaskCreatePayload } from "../payload/task-create-payload";
import { TaskUpdatePayload } from "../payload/task-update-payload";
import { TaskJson } from "../models/task-json";
import { GroupRepository } from "../../group/repository/group-repository";
import { OrganizationRepository } from "../../organization/repository/organization-repository";
import { invenzaAppleTaskModel, invenzaGoogleTaskModel } from "../../../database-models/task";

export class TaskRepository extends CockpitRepository<Task>{
    private file: FileManager;
    private groupRepository: GroupRepository;
    private organizationRepository: OrganizationRepository;

    constructor() {
        super();
        this.file = new FileManager("database", "tasks");
        this.groupRepository = new GroupRepository();
        this.organizationRepository = new OrganizationRepository();
        this.file.initializeFile();

        if(this.file.isEmpty()){
            this.initializeFile();
        }
    }

    private initializeFile(){
        this.file.saveJsonAsFile([
            invenzaGoogleTaskModel,
            invenzaAppleTaskModel,
        ]);
    }

    add(payload: TaskCreatePayload): Task | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newTask = new Task({
            id: newId, 
            title: payload.title, 
            description: payload.description, 
            deadline: payload.deadline, 
            groupsIdList: payload.groupsIdList, 
            groupsList: null,
            createdAt: DateTime.getFullTimestamp(), 
            createdBy: payload.createdBy, 
            status: "toDo", 
            locked: payload.locked ?? false,
            comments: [],
            commentsEnabled: payload.commentsEnabled,
        })

        if(payload.description == null || isOnlyWhitespace(payload.description)){
            newTask.description = null;
        }

        const taskJson = newTask.toJson();

        if(!taskJson) return null;

        jsonData.push(taskJson);

        this.file.saveJsonAsFile(jsonData);

        return newTask;
    }

    get(resourceId: number): Task | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === resourceId);
        
        if(!taskJson) return null;

        const task: Task | null = Task.fromJson(taskJson);

        if(!task) return null;

        const groupsIdList: number[] = task.groupsIdList;

        let tmpList: Group[] = [];

        groupsIdList.forEach((item) => {
            const group = this.groupRepository.get(item);

            if(group) tmpList.push(group);
        })

        task.groupsList = tmpList;

        return task;
    }

    getAll(resourceId: number): Task[] | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const groups: Group[] | null = this.groupRepository.getAll(resourceId);
        if(groups == null) return null;

        const organization: Organization | null = this.organizationRepository.getOrganizationByUserId(resourceId);
        if(!organization) return null;

        const isAdmin: boolean = organization.admin.id === resourceId;

        const groupsIdList: number[] = groups.map(group => group.id);

        const filteredData: Task[] = jsonData
            .filter((task) => {
                return task.groupsIdList.some((item: number) => {
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

    update(payload: TaskUpdatePayload): number | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === payload.id);

        if (!taskJson) return null;
    
        taskJson.title = payload.title;
        taskJson.description = payload.description;
        taskJson.deadline = payload.deadline; 
        taskJson.groupsIdList = payload.groupsIdList;
        taskJson.status = payload.status;
        taskJson.commentsEnabled = payload.commentsEnabled;

        if(payload.locked != null){
            taskJson.locked = payload.locked;
        }

        if(isOnlyWhitespace(payload.description ?? '')){
            taskJson.description = null;
        }

        this.file.saveJsonAsFile(jsonData);

        return payload.id;
    }

    delete(resourceId: number): boolean {
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const filteredData: TaskJson[] | undefined = jsonData.filter((item) => item.id !== resourceId);

        if(!filteredData) return false;

        this.file.saveJsonAsFile(filteredData);

        return true;
    }
}