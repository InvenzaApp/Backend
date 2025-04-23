import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import organizationRouter from './routers/organization';
import groupsRouter from './routers/group';
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

app.get('/', (req, res) => {
   res.send('Hello, world!');
})

const initialize = () => {
   new UserModule(true);
   new OrganizationModule(true);
   new TaskModule(true);
   new GroupModule(true);
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
