import FileManager from "../managers/file-manager";
import IdGetter from "../helpers/id-getter";
import {Event, EventJson} from "../models/event";
import UserModule from "./user-module";

export class CalendarModule{
    file = new FileManager("database", "calendar");
    userModule = new UserModule();

    constructor(){
        this.file.initializeFile();
    }

    getEvents(): Event[]{
        const jsonData = this.file.getFileAsJson();
        return jsonData.map((e: any) => {
            const user = this.userModule.getUserById(e.creatorId);
            e.author = user;
            const event = Event.fromJson(e);
            return event;
        });
    }

    getEvent(eventId: number): Event | null{
        const jsonData = this.file.getFileAsJson();
        const event = jsonData.find((item: EventJson) => item.id === eventId);

        if(!event) return null;

        const user = this.userModule.getUserById(event.creatorId);

        if(!user) return null;

        event.author = user.toJson();    

        return event;
    }

    addEvent(
        creatorId: number,
        organizationId: number,
        title: string,
        description: string | null,
        dateFrom: string,
        dateTo: string,
        locked: boolean,
    ): number{
        const jsonData = this.file.getFileAsJson();

        const newId = IdGetter(jsonData);

        const newEvent = new Event(
            newId,
            organizationId,
            title,
            description,
            null,
            creatorId,
            dateFrom,
            dateTo,
            locked,
        );

        jsonData.push(newEvent.toJson());
        this.file.saveJsonAsFile(jsonData);
        return newId;
    }

    deleteEvent(eventId: number){
        const jsonData = this.file.getFileAsJson();
        const filteredData = jsonData.filter((item: any) => item.id !== eventId);
        this.file.saveJsonAsFile(filteredData);
    }

    updateEvent(
        eventId: number,
        title: string,
        description: string | null,
        dateFrom: string,
        dateTo: string,
        locked: boolean | null
    ){
        const jsonData = this.file.getFileAsJson();
        const event = jsonData.find((json: EventJson) => json.id === eventId);

        if(!event) return;

        event.title = title;
        event.dateFrom = dateFrom;
        event.dateTo = dateTo;

        if(description != null){
            if(description == ''){
                event.description = null;
            }else{
                event.description = description;
            }
        }

        if(locked != null){
            event.locked = locked;
        }

        this.file.saveJsonAsFile(jsonData);
    }
}