import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { CockpitRepository } from './cockpit-repository';
import { ItemEntity } from '../item-enitity/item-entity';

export abstract class RouterRepository<T extends ItemEntity>{
    public repository: CockpitRepository<T>;

    constructor(repository: CockpitRepository<T>){
        this.repository = repository;
    }

    abstract get(req: ExpressRequest, res: ExpressResponse): void;

    abstract getAll(req: ExpressRequest, res: ExpressResponse): void;
    
    abstract post(req: ExpressRequest, res: ExpressResponse): void;
    
    abstract put(req: ExpressRequest, res: ExpressResponse): void;
    
    abstract delete(req: ExpressRequest, res: ExpressResponse): void;
}