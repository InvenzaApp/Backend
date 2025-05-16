import express from 'express';

import './features/group/helpers/group-repository/prototypes/add-user-to-groups';
import './features/group/helpers/group-repository/prototypes/delete-user-from-groups';
import './features/group/helpers/group-repository/prototypes/get-added-users-id-list-on-update';
import './features/group/helpers/group-repository/prototypes/get-group-name-by-id';
import './features/group/helpers/group-repository/prototypes/get-removed-users-id-list-on-update';
import './features/group/helpers/group-repository/prototypes/update-user-groups';

import './features/task/helpers/task-repository/prototypes/get-added-groups-id-list-on-update';
import './features/task/helpers/task-repository/prototypes/get-deleted-groups-id-list-on-update';
import './features/task/helpers/task-repository/prototypes/remove-group-from-tasks';

import './features/user/helpers/user-repository/prototypes/add-group-to-users';
import './features/user/helpers/user-repository/prototypes/delete-group-from-users';
import './features/user/helpers/user-repository/prototypes/get-users-by-id';
import './features/user/helpers/user-repository/prototypes/sign-in';
import './features/user/helpers/user-repository/prototypes/update-password';
import './features/user/helpers/user-repository/prototypes/update-self-account';
import './features/user/helpers/user-repository/prototypes/update-user-groups';

import './features/organization/helpers/organization-repository/prototypes/add-user';
import './features/organization/helpers/organization-repository/prototypes/delete-user';
import './features/organization/helpers/organization-repository/prototypes/get-organization-admin';
import './features/organization/helpers/organization-repository/prototypes/get-organization-by-user-id';

import userRouter from './features/user/routers/user-router';
import organizationRouter from './features/organization/routers/organization-router';
import tokenRouter from './features/token/routers/token-router';
import calendarRouter from './features/calendar/routers/calendar-router';
import permissionRouter from './features/permission/routers/permission-router';
import tasksRouter from './features/task/routers/task-router';
import groupsRouter from './features/group/routers/group-router';
import commentsRouter from './features/comments/routers/comments-router';
import fs from "fs";
import * as https from "node:https";
import * as http from "node:http";
import path from "path";

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

if(isDebug){
   http.createServer(app).listen(port, () => {
      console.log(`Server started on port ${port}`);
   });
}else{
   const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, './cert/key.pem')),
      cert: fs.readFileSync(path.join(__dirname, './cert/cert.pem')),
      ca: fs.readFileSync(path.join(__dirname, './cert/ca.pem')),
   }
   
   https.createServer(sslOptions, app).listen(port, () => {
      console.log(`Server started on port ${port}`);
   });
}
