import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {express as expressConfig, mongo as mongoConfig} from './config/config';
import cors from 'cors';
import users from './routes/api/users';
import {parseToken} from './middlewares/auth';

const app = express();

// Enabling CORS
app.use(cors());

// Body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Token parsing middleware
app.use(parseToken as any);

// Routes
app.use('/api/users', users);

// Connect to MongoDB
const {user, password, host, database} = mongoConfig;
const mongoURI = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`;

console.log(`connecting to MongoDB through uri ${mongoURI}...`);
mongoose
  .connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('successfully connected to MongoDB...'))
  .catch(err => console.log(err));

// Express config variables
const {serverPort} = expressConfig;

// Express server listening
// eslint-disable-next-line no-unused-vars
const server = app.listen(serverPort, () => {
  console.log(`server listening on port ${serverPort}...`);
});
