import FileManager from '../managers/file-manager';
import messaging from '../managers/firebase-manager';
require('dotenv').config();

export class NotificationsManager{
    file = new FileManager("database", "tokens");
    groupsFile = new FileManager("database", "groups");

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

    sendNotificationToUser(userId: number, message: string){
        const jsonData = this.file.getFileAsJson();

        const foundUser = jsonData.find((user: any) => user.userId === userId);

        if(!foundUser) return;

        this.sendNotification(message, foundUser.token);
    }

    sendNotificationToUsers(userIdList: number[], message: string){
        const jsonData = this.file.getFileAsJson();

        userIdList.forEach((userId: number) => {
            const foundUser = jsonData.find((user: any) => user.userId === userId);
            
            if(!foundUser) return;

            this.sendNotification(message, foundUser.token);
        });
    }

    sendNotificationToGroup(groupId: number, message: string){
        const jsonData = this.file.getFileAsJson();
        const jsonGroupsData = this.groupsFile.getFileAsJson();

        const foundGroup = jsonGroupsData.find((group: any) => group.id === groupId);

        if(!foundGroup) return;

        const usersIdList = foundGroup.usersIdList as number[];

        usersIdList.forEach((userId: number) => {
            const foundUser = jsonData.find((user: any) => user.userId === userId);

            if(!foundUser) return;

            this.sendNotification(message, foundUser.token);
        });
    }

    sendNotificationToGroups(groupsIdList: number[], message: string){
        groupsIdList.forEach((groupId: number) => {
            this.sendNotificationToGroup(groupId, message);
        })
    }

    private sendNotification(message: string, token: string){
        const payload = {
            notification: {
                title: "Powiadomienie",
                body: message
            },
            apns: {
                payload: {
                  aps: {
                    alert: {
                      title: "Powiadomienie",
                      body: message
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