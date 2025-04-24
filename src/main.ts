import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import organizationRouter from './routers/organization';
import groupsRouter from './routers/group';
import permissionRouter from './routers/permission';
import UserModule from './modules/user-module';
import OrganizationModule from "./modules/organization-module";
import {TaskModule} from "./modules/task-module";
import {GroupModule} from "./modules/group-module";
import fs from "fs";
import * as https from "node:https";
import path from "path";

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/permissions', permissionRouter);

app.get('/', (req, res) => {
   res.send('Hello, world!');
})

const initialize = () => {
   const isDebug = process.env.DEBUG == "true";

   new UserModule(isDebug);
   new OrganizationModule(isDebug);
   new TaskModule(isDebug);
   new GroupModule(isDebug);
}

const sslOptions = {
   key: fs.readFileSync(path.join(__dirname, './cert/key.pem')),
   cert: fs.readFileSync(path.join(__dirname, './cert/cert.pem')),
   ca: fs.readFileSync(path.join(__dirname, './cert/ca.pem')),
}

https.createServer(sslOptions, app).listen(port, () => {
   initialize();
   console.log(`Server started on port ${port}`);
});
