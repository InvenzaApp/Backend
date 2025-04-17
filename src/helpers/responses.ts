import { Response as ExpressResponse } from 'express';

export const performSuccessResponse = (res: ExpressResponse, data: any = null, success: boolean = true, ) => {
    res.status(200).send({'success': success, 'data': data});
};

export const performFailureResponse = (res: ExpressResponse, error: any = null) => {
    res.status(401).send({'success': false, 'data': error});
}