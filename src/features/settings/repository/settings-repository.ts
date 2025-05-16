import FileManager from "../../../managers/file-manager";
import { UserSettingsJson } from "../models/user-settings-json";

export class SettingsRepository{
    file = new FileManager("database", "user-settings");

    constructor(){
        this.file.initializeFile();
    }

    changeLanguage(
        userId: number, 
        locale: string | undefined
    ): boolean{
        const jsonData: UserSettingsJson[] = this.file.getFileAsJson();

        const userSettingsJson: UserSettingsJson | undefined = jsonData.find((item) => item.userId === userId);

        if(userSettingsJson){
            if(locale != null){
                userSettingsJson.locale = locale;
            }
        }else{
            const newSettings: UserSettingsJson = {
                'userId': userId,
                'locale': locale ?? 'pl'
            }
    
            jsonData.push(newSettings);
        }

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    removeLanguage(userId: number): boolean{
        const jsonData: UserSettingsJson[] = this.file.getFileAsJson();

        const filteredData: UserSettingsJson[] = jsonData.filter((item) => item.userId !== userId);

        this.file.saveJsonAsFile(filteredData);

        return true;
    }
}
