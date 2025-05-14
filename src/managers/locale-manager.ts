import { UserSettings, UserSettingsJson } from "../models/user-settings";
import FileManager from "./file-manager";
import fs from 'fs';

export class LocaleManager{
    file = new FileManager("database", "user-settings");

    getMessage(userId: number, messageCode: string): string{
        const settingsJsonData: UserSettingsJson[] = this.file.getFileAsJson();
        const settingsJson: UserSettingsJson | undefined = settingsJsonData.find((item) => item.userId === userId);

        if(!settingsJson) return "UNKNOWN MESSAGE";

        const settings = UserSettings.fromJson(settingsJson);

        const language = settings.locale;
        
        const fileData = fs.readFileSync(`./src/l10n/${language}.json`).toString();
        const jsonData = JSON.parse(fileData);

        return jsonData[messageCode] ?? "UNKNOWN MESSAGE";
    }
}