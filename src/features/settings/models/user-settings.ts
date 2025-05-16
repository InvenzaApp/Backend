import { UserSettingsCreatePayload } from "../payload/user-settings-create-payload";
import { UserSettingsJson } from "./user-settings-json";

export class UserSettings{
    public userId: number;
    public locale: string;
    
    constructor(payload: UserSettingsCreatePayload){
        this.userId = payload.userId;
        this.locale = payload.locale;
    }

    static fromJson(json: UserSettingsJson): UserSettings{
        return new UserSettings({
            userId: json.userId,
            locale: json.locale,
        });
    }

    toJson(): UserSettingsJson {
        return {
            userId: this.userId,
            locale: this.locale,
        }
    }
}