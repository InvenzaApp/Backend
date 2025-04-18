import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import organizationRouter from './routers/organization';
import UserModule from './modules/user-module';
import OrganizationModule from "./modules/organization-module";
import {TaskModule} from "./modules/task-module";

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/organization', organizationRouter);

const initialize = () => {
   new UserModule(true);
   new OrganizationModule(true);
   new TaskModule(true);
}

app.listen(port, () => {
   initialize();
   console.log(`Server started on port ${port}`);
});