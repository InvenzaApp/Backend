export type UserSettingsJson = {
    userId: number;
    locale: string;
}

export class UserSettings{
    constructor(
        public userId: number,
        public locale: string,
    ){}

    static fromJson(json: UserSettingsJson): UserSettings{
        return new UserSettings(
            json.userId,
            json.locale,
        );
    }

    toJson(): UserSettingsJson {
        return {
            userId: this.userId,
            locale: this.locale,
        }
    }
}