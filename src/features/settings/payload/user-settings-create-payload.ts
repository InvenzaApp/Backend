import { CreatePayload } from "../../../core/repository/models/payload/create-payload";

export interface UserSettingsCreatePayload extends CreatePayload{
    userId: number;
    locale: string;
}