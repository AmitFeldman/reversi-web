import express from 'express';
import 'module-alias/register';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {express as expressConfig, mongo as mongoConfig} from './config/config';
import cors from 'cors';
import users from './routes/api/users';
import {parseToken} from './middlewares/auth';
import {initSocketIO, on} from './utils/socket-service';
import {initChangesListener} from './utils/changes-listener';
import {initSocketManager} from './services/socket-manager';
import {
  ClientEvents,
  CreateRoomArgs,
  JoinRoomArgs,
  LeaveRoomArgs,
  PlayerMoveArgs,
} from 'reversi-types';
import {createRoom, joinRoom, playerMove, leaveRoom} from './utils/room';

console.log('starting reversi-web server...');

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

initSocketManager((socket) => {
  const cancelOnCreateRoom = on<CreateRoomArgs>(
    socket,
    ClientEvents.CREATE_ROOM,
    createRoom
  );
  
  const cancelOnJoinRoom = on<JoinRoomArgs>(
    socket,
    ClientEvents.JOINED,
    joinRoom
  );
  
  const cancelOnPlayerMove = on<PlayerMoveArgs>(
    socket,
    ClientEvents.PLAYER_MOVE,
    playerMove
  );
  
  const cancelOnPlayerLeaveRoom = on<LeaveRoomArgs>(
    socket,
    ClientEvents.LEAVE_ROOM,
    leaveRoom
  );

  return () => {
    cancelOnCreateRoom();
    cancelOnJoinRoom();
    cancelOnPlayerMove();
    cancelOnPlayerLeaveRoom();
  };
});
