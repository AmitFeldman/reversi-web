import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {express as expressConfig, mongo as mongoConfig} from './config/config';
import socketIO from 'socket.io';
import cors from 'cors';
import users from './routes/api/users';
import games from './routes/api/games'
import {parseToken} from './middlewares/auth';
import http from "http";
import {initSocketIO} from './utils/socket-service';


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
app.use('/api/games', games);

// Connect to MongoDB
const {user, password, host, database} = mongoConfig;
const mongoURI = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`;

console.log(`connecting to MongoDB through uri ${mongoURI}...`);
mongoose
  .connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('successfully connected to MongoDB...'))
  .catch(err => console.log(err));

// Express config variables
const {serverPort, socketPort} = expressConfig;

// Express server listening
// eslint-disable-next-line no-unused-vars
const server = app.listen(serverPort, () => {
  console.log(`server listening on port ${serverPort}...`);
});

const socketServer = new http.Server(app);
const io = socketIO(socketServer);

// Socket server listening
socketServer.listen(socketPort);
console.log(`socket listening on port ${socketPort}...`);

initSocketIO(io);
