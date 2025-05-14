import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import organizationRouter from './routers/organization';
import groupsRouter from './routers/group';
import tokenRouter from './routers/token';
import commentsRouter from './routers/comments';
import calendarRouter from './routers/calendar';
import permissionRouter from './routers/permission';
import UserModule from './modules/user-module';
import OrganizationModule from "./modules/organization-module";
import {TaskModule} from "./modules/task-module";
import {GroupModule} from "./modules/group-module";
import fs from "fs";
import * as https from "node:https";
import * as http from "node:http";
import path from "path";
import { SettingsModule } from './modules/settings-module';

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;
const isDebug = process.env.DEBUG == "true";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/permissions', permissionRouter);
app.use('/api/token', tokenRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/calendar', calendarRouter);

const initialize = () => {
   new SettingsModule();
   new UserModule();
   new OrganizationModule();
   new TaskModule();
   new GroupModule();
}

if(isDebug){
   http.createServer(app).listen(port, () => {
      initialize();
      console.log(`Server started on port ${port}`);
   });
}else{
   const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, './cert/key.pem')),
      cert: fs.readFileSync(path.join(__dirname, './cert/cert.pem')),
      ca: fs.readFileSync(path.join(__dirname, './cert/ca.pem')),
   }
   
   https.createServer(sslOptions, app).listen(port, () => {
      initialize();
      console.log(`Server started on port ${port}`);
   });
}
