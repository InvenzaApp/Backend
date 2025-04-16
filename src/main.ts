import express from 'express';
import userRouter from './routers/user';
import UserModule from './modules/user-module';
import CompanyModule from "./modules/company-module";

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);

const initialize = () => {
   new UserModule(true);
   new CompanyModule(true);
}

app.listen(port, () => {
   initialize();
   console.log(`Server started on port ${port}`);
});