import express from 'express';
import user from './routers/user';
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', user);

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});