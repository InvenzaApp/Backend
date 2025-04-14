import express from 'express';
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});