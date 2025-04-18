import { Response as ExpressResponse } from 'express';

export const performSuccessResponse = (res: ExpressResponse, data: any = null, token: string) => {
    res.status(200).send({'success': true, 'data': data, 'token': token});
};

export const performFailureResponse = (res: ExpressResponse, error: any = null) => {
    res.status(200).send({'success': false, 'data': error});
}