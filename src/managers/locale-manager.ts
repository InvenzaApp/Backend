import FileManager from "./file-manager";
import fs from 'fs';

export class LocaleManager{
    file = new FileManager("database", "user-settings");

    getMessage(userId: number, messageCode: string): string{
        const localeJson = this.file.getFileAsJson();
        const foundUser = localeJson.find((user: any) => user.userId === userId);

        if(!foundUser) return "UNKNOWN MESSAGE";

        const language = foundUser.locale;
        
        const fileData = fs.readFileSync(`./src/l10n/${language}.json`).toString();
        const jsonData = JSON.parse(fileData);

        return jsonData[messageCode] ?? "UNKNOWN MESSAGE";
    }
}