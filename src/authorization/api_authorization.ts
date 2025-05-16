import {NextFunction, Request as ExpressRequest, Response as ExpressResponse} from "express";
import {performFailureResponse} from "../helpers/responses";
import {UNAUTHORIZED_ACCESS} from "../helpers/response-codes";
import jwt from "jsonwebtoken";
import { SettingsRepository } from "../features/settings/repository/settings-repository";

require('dotenv').config();
const settings = new SettingsRepository();

export const authMiddleware = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const headers = req.headers['authorization'];
    const locale = req.get('locale');
    const token = headers?.split(' ')[1];
    const secretKey = process.env.API_TOKEN as string;

    if(!token){
        performFailureResponse(res, UNAUTHORIZED_ACCESS);
        return;
    }

    try{
        (req as any).user = jwt.verify(token, secretKey);

        const userId = (req as any).user.userId;
        settings.changeLanguage(userId, locale);
        next();
    }catch(err){
        performFailureResponse(res, UNAUTHORIZED_ACCESS);
    }
}