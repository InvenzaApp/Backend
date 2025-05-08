import FileManager from '../managers/file-manager';
import messaging from '../managers/firebase-manager';
import { LocaleManager } from './locale-manager';
require('dotenv').config();

export class NotificationsManager{
    file = new FileManager("database", "tokens");
    groupsFile = new FileManager("database", "groups");
    localeManager = new LocaleManager();

    constructor(){
        this.file.initializeFile();
    }

    registerToken(userId: number, token: string){
        const jsonData = this.file.getFileAsJson();

        const existingToken = jsonData.find((item: any) => item.token == token);

        if(!existingToken){
            jsonData.push({
                'token': token,
                'userId': userId,
            });
        }else{
            existingToken.userId = userId;
        }

        this.file.saveJsonAsFile(jsonData);
    }

    sendNotificationToUser(userId: number, messageCode: string){
        const jsonData = this.file.getFileAsJson();

        const foundUser = jsonData.find((user: any) => user.userId === userId);

        if(!foundUser) return;

        this.sendNotification(userId, messageCode, foundUser.token);
    }

    sendNotificationToUsers(userIdList: number[], messageCode: string){
        const jsonData = this.file.getFileAsJson();

        userIdList.forEach((userId: number) => {
            const foundUser = jsonData.find((user: any) => user.userId === userId);
            
            if(!foundUser) return;

            this.sendNotification(userId, messageCode, foundUser.token);
        });
    }

    sendNotificationToGroup(groupId: number, messageCode: string){
        const jsonData = this.file.getFileAsJson();
        const jsonGroupsData = this.groupsFile.getFileAsJson();

        const foundGroup = jsonGroupsData.find((group: any) => group.id === groupId);

        if(!foundGroup) return;

        const usersIdList = foundGroup.usersIdList as number[];

        usersIdList.forEach((userId: number) => {
            const foundUser = jsonData.find((user: any) => user.userId === userId);

            if(!foundUser) return;

            this.sendNotification(userId, messageCode, foundUser.token);
        });
    }

    sendNotificationToGroups(groupsIdList: number[], message: string){
        groupsIdList.forEach((groupId: number) => {
            this.sendNotificationToGroup(groupId, message);
        })
    }

    private sendNotification(userId: number, messageCode: string, token: string){
        const title = this.localeManager.getMessage(userId, "notification");
        const message = this.localeManager.getMessage(userId, messageCode);

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