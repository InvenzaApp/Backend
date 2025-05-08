import FileManager from "../managers/file-manager";

export class SettingsModule{
    file = new FileManager("database", "user-settings");

    constructor(){
        this.file.initializeFile();
    }

    changeLanguage(userId: number, locale: string | undefined){
        const jsonData = this.file.getFileAsJson();

        const foundUser = jsonData.find((user: any) => user.userId === userId);

        if(foundUser){
            if(locale != null){
                foundUser.locale = locale;
            }
        }else{
            const newUser = {
                'userId': userId,
                'locale': locale ?? 'pl'
            }
    
            jsonData.push(newUser);
        }

        this.file.saveJsonAsFile(jsonData);
    }

    removeLanguage(userId: number){
        const jsonData = this.file.getFileAsJson();

        const filteredData = jsonData.filter((user: any) => user.userId !== userId);

        this.file.saveJsonAsFile(filteredData);
    }
}
