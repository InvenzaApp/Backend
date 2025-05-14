import { ItemEntity } from "../item-entity";

export abstract class CockpitRepository<T extends ItemEntity>{
    abstract get(resourceId: number): T | null;

    
}