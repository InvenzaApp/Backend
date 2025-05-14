import FileManager from '../managers/file-manager';
import messaging from '../managers/firebase-manager';
import { GroupJson } from '../models/group';
import { Token, TokenJson } from '../models/token';
import { LocaleManager } from './locale-manager';
require('dotenv').config();

export class NotificationsManager{
    file = new FileManager("database", "tokens");
    groupsFile = new FileManager("database", "groups");
    localeManager = new LocaleManager();

    constructor(){
        this.file.initializeFile();
    }

    registerToken(
        userId: number, 
        token: string
    ): boolean{
        const jsonData: TokenJson[] = this.file.getFileAsJson();

        const existingToken: TokenJson | undefined = jsonData.find((item: any) => item.token == token);

        if(!existingToken){
            jsonData.push({
                'token': token,
                'userId': userId,
            });
        }else{
            existingToken.userId = userId;
        }

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

    sendNotificationToUser(
        userId: number, 
        messageCode: string
    ): boolean{
        const jsonData: TokenJson[] = this.file.getFileAsJson();

        const tokenJson: TokenJson | undefined = jsonData.find((item) => item.userId === userId);

        if(!tokenJson) return false;

        const token = Token.fromJson(tokenJson);

        this.sendNotification(userId, messageCode, token.token);

        return true;
    }

    sendNotificationToUsers(
        userIdList: number[], 
        messageCode: string
    ): boolean{
        const jsonData: TokenJson[] = this.file.getFileAsJson();

        userIdList.forEach((item) => {
            const tokenJson: TokenJson | undefined = jsonData.find((token: any) => token.userId === item);
            
            if(!tokenJson) return false;

            const token = Token.fromJson(tokenJson);

            this.sendNotification(item, messageCode, token.token);
        });

        return true;
    }

    sendNotificationToGroup(
        groupId: number, 
        messageCode: string
    ): boolean{
        const jsonData: TokenJson[] = this.file.getFileAsJson();
        const jsonGroupsData: GroupJson[] = this.groupsFile.getFileAsJson();

        const groupJson: GroupJson | undefined = jsonGroupsData.find((item) => item.id === groupId);

        if(!groupJson) return false;

        const usersIdList = groupJson.usersIdList;

        usersIdList.forEach((item) => {
            const tokenJson: TokenJson | undefined = jsonData.find((token) => token.userId === item);

            if(!tokenJson) return false;

            const token: Token = Token.fromJson(tokenJson);

            this.sendNotification(item, messageCode, token.token);
        });

        return true;
    }

    sendNotificationToGroups(
        groupsIdList: number[], 
        message: string
    ): boolean {
        groupsIdList.forEach((item) => {
            this.sendNotificationToGroup(item, message);
        })

        return true;
    }

    private sendNotification(
        userId: number, 
        messageCode: string, 
        token: string
    ){
        const title: string = this.localeManager.getMessage(userId, "notification");
        const message: string = this.localeManager.getMessage(userId, messageCode);

        const payload = {
            notification: {
                title: title,
                body: message,
            },
            apns: {
                payload: {
                  aps: {
                    alert: {
                      title: title,
                      body: message,
                    },
                    sound: "default"
                  }
                }
            },
            token: token,
        };

        messaging
            .send(payload)
            .catch((error: any) => {
                console.log(`[Notifications] Error: ${error.message}`);
            })
    }
}