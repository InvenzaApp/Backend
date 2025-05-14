import FileManager from "../managers/file-manager";
import IdGetter from "../helpers/id-getter";
import { Event, EventJson } from "../models/event";
import UserModule from "./user-module";
import { User } from "../models/user";

export class CalendarModule{
    file = new FileManager("database", "calendar");
    userModule = new UserModule();

    constructor(){
        this.file.initializeFile();
    }

    getEvents(): Event[]{
        const jsonData: EventJson[] = this.file.getFileAsJson();

        return jsonData.flatMap((item) => {
            const user: User | null = this.userModule.getUserById(item.creatorId);

            if(!user) return [];

            item.author = user;

            const event = Event.fromJson(item);

            return event;
        });
    }

    getEvent(eventId: number): Event | null{
        const jsonData: EventJson[] = this.file.getFileAsJson();
        const eventJson: EventJson | undefined = jsonData.find((item) => item.id === eventId);

        if(!eventJson) return null;

        const user = this.userModule.getUserById(eventJson.creatorId);

        if(!user) return null;

        eventJson.author = user;    

        return Event.fromJson(eventJson);
    }

    addEvent(
        creatorId: number,
        organizationId: number,
        title: string,
        description: string | null,
        dateFrom: string,
        dateTo: string,
        locked: boolean,
    ): Event{
        const jsonData: EventJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newEvent = new Event({
            id: newId,
            organizationId: organizationId,
            title: title,
            description: description,
            author: null,
            creatorId: creatorId,
            dateFrom: dateFrom,
            dateTo: dateTo,
            locked: locked,
        });

        jsonData.push(newEvent.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newEvent;
    }

    deleteEvent(eventId: number): boolean{
        const jsonData: EventJson[] = this.file.getFileAsJson();

        const filteredData: EventJson[] = jsonData.filter((item) => item.id !== eventId);

        this.file.saveJsonAsFile(filteredData);

        return true;
    }

    updateEvent(
        eventId: number,
        title: string,
        description: string | null,
        dateFrom: string,
        dateTo: string,
        locked: boolean | null
    ): boolean{
        const jsonData: EventJson[] = this.file.getFileAsJson();
        
        const eventJson: EventJson | undefined = jsonData.find((json) => json.id === eventId);

        if(!eventJson) return false;

        eventJson.title = title;
        eventJson.dateFrom = dateFrom;
        eventJson.dateTo = dateTo;

        if(description != null){
            if(description == ''){
                eventJson.description = null;
            }else{
                eventJson.description = description;
            }
        }

        if(locked != null){
            eventJson.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);

        return true;
    }
}