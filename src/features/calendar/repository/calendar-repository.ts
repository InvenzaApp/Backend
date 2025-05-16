import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import FileManager from "../../../managers/file-manager";
import { User } from "../../user/models/user";
import { UserRepository } from "../../user/repository/user-repository";
import { Event } from "../models/event";
import { EventJson } from "../models/event-json";
import IdGetter from "../../../helpers/id-getter";
import { EventCreatePayload } from "../payload/event-create-payload";
import { EventUpdatePayload } from "../payload/event-update-payload";
import { OrganizationRepository } from "../../organization/repository/organization-repository";

export class CalendarRepository extends CockpitRepository<Event> {
    file: FileManager;
    private userRepository: UserRepository;
    private organizationRepository: OrganizationRepository;

    constructor() {
        super();
        this.file = new FileManager("database", "calendar");
        this.file.initializeFile();
        this.userRepository = new UserRepository();
        this.organizationRepository = new OrganizationRepository();
    }

    add(payload: EventCreatePayload): Event | null {
        const jsonData: EventJson[] = this.file.getFileAsJson();

        const newId: number = IdGetter(jsonData);

        const newEvent = new Event({
            id: newId,
            organizationId: payload.organizationId,
            title: payload.title,
            description: payload.description,
            author: null,
            creatorId: payload.creatorId,
            dateFrom: payload.dateFrom,
            dateTo: payload.dateTo,
            locked: payload.locked,
        });

        jsonData.push(newEvent.toJson());

        this.file.saveJsonAsFile(jsonData);

        return newEvent;
    }

    get(resourceId: number): Event | null {
        const jsonData: EventJson[] = this.file.getFileAsJson();
        const eventJson: EventJson | undefined = jsonData.find((item) => item.id === resourceId);

        if (!eventJson) return null;

        const user = this.userRepository.get(eventJson.creatorId);

        if (!user) return null;

        eventJson.author = user;

        return Event.fromJson(eventJson);
    }

    getAll(resourceId: number): Event[] | null {
        const jsonData: EventJson[] = this.file.getFileAsJson();

        const organization = this.organizationRepository.getOrganizationByUserId(resourceId);

        if(organization == null) return null;

        const filteredData = jsonData.filter((item) => item.organizationId === organization.id);

        if(filteredData == null) return null;

        return filteredData.flatMap((item) => {
            const user: User | null = this.userRepository.get(item.creatorId);

            if (!user) return [];

            item.author = user;

            const event = Event.fromJson(item);

            return event;
        });
    }

    update(payload: EventUpdatePayload): number | null {
        const jsonData: EventJson[] = this.file.getFileAsJson();
        
        const eventJson: EventJson | undefined = jsonData.find((json) => json.id === payload.eventId);

        if(!eventJson) return null;

        eventJson.title = payload.title;
        eventJson.dateFrom = payload.dateFrom;
        eventJson.dateTo = payload.dateTo;

        if(payload.description != null){
            if(payload.description == ''){
                eventJson.description = null;
            }else{
                eventJson.description = payload.description;
            }
        }

        if(payload.locked != null){
            eventJson.locked = payload.locked;
        }

        this.file.saveJsonAsFile(jsonData);

        return payload.eventId;
    }

    delete(resourceId: number): boolean {
        const jsonData: EventJson[] = this.file.getFileAsJson();

        const filteredData: EventJson[] = jsonData.filter((item) => item.id !== resourceId);

        this.file.saveJsonAsFile(filteredData);

        return true;
    }
}