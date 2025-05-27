import { ItemEntity } from "../item-enitity/item-entity";
import { CreatePayload } from "./models/payload/create-payload";
import { UpdatePayload } from "./models/payload/update-payload";

export abstract class CockpitRepository<T extends ItemEntity>{
    abstract add(payload: CreatePayload): T | null;

    abstract get(resourceId: number): T | null;

    abstract getAll(resourceId: number, organizationId: number): T[] | null;

    abstract update(payload: UpdatePayload): number | null;

    abstract delete(resourceId: number): boolean;
}