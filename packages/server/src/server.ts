import express from 'express';
import 'module-alias/register';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {express as expressConfig, mongo as mongoConfig} from './config/config';
import cors from 'cors';
import users from './routes/api/users';
import {parseToken} from './middlewares/auth';
import {initSocketIO} from './utils/socket-service';
import {initChangesListener} from './utils/changes-listener';
import {initDbListeners, initSocketListeners} from './services/socket-manager';

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
app.use(parseToken);

// Routes
app.use('/api/users', users);

// Connect to MongoDB
const {user, password, host, database} = mongoConfig;
const mongoURI = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`;

console.log(`connecting to MongoDB through uri ${mongoURI}...`);
mongoose
  .connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('successfully connected to MongoDB...');

    // Listens to changes in mongoDB
    initChangesListener();
  })
  .catch((err) => console.log(err));

// Express config variables
const {serverPort} = expressConfig;

// Express server listening
const server = app.listen(serverPort, () => {
  console.log(`server listening on port ${serverPort}...`);
});

// Init socket.io
initSocketIO(app);
initSocketListeners();
initDbListeners();
