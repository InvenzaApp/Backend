import express from 'express';
import userRouter from './routers/user';
import tasksRouter from './routers/task';
import UserModule from './modules/user-module';
import CompanyModule from "./modules/company-module";
import {TaskModule} from "./modules/task-module";

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/tasks', tasksRouter);

const initialize = () => {
   new UserModule(true);
   new CompanyModule(true);
   new TaskModule(true);
}

app.listen(port, () => {
   initialize();
   console.log(`Server started on port ${port}`);
});