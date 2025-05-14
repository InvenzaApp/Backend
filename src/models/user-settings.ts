interface UserSettingsParams{
    userId: number;
    locale: string;
}

export type UserSettingsJson = {
    userId: number;
    locale: string;
}

export class UserSettings{
    public userId: number;
    public locale: string;
    
    constructor(params: UserSettingsParams){
        this.userId = params.userId;
        this.locale = params.locale;
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