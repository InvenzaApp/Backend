import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import groupsRouter from './routers/group';
import UserModule from './modules/user-module';
import CompanyModule from "./modules/company-module";
import {TaskModule} from "./modules/task-module";
import {GroupModule} from "./modules/group-module";

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/groups', groupsRouter);

const initialize = () => {
   new UserModule(true);
   new CompanyModule(true);
   new TaskModule(true);
   new GroupModule(true);
}

app.listen(port, () => {
   initialize();
   console.log(`Server started on port ${port}`);
});