// import {Socket} from 'socket.io';
// import GameModel, {Cell, GameStatus, GameType} from '../models/Game';
// import {
//   moveResponse,
//   ServerEvents,
//   ClientEvents,
//   PlayerMoveArgs,
// } from '../types/events';
// import {emitEventToSocket, joinRoom, on} from '../utils/socket-service';
//
// interface IBaseGame {
//   id: string;
//   socket: Socket;
//   type: GameType;
// }
//
// class BaseGame implements IBaseGame {
//   id: string = '';
//   socket: Socket;
//   type: GameType;
//
//   constructor(socket: Socket, type: GameType) {
//     this.socket = socket;
//     this.type = type;
//   }
//
//   // All async logic for preparing game (saving to db, connecting all players)
//   async init() {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const newGame = new GameModel({
//           type: this.type,
//           whitePlayer: {
//             isCPU: false,
//           },
//           blackPlayer: {
//             isCPU: true,
//             difficulty: "EASY",
//           },
//         });
//
//         const game = await newGame.save();
//         this.id = game._id.toString();
//
//         joinRoom(this.socket, this.id);
//         emitEventToSocket(this.socket, ServerEvents.CreatedRoom, this.id);
//
//         on(this.socket, ClientEvents.Ready, resolve);
//       } catch (e) {
//         reject(e);
//       }
//     });
//   }
//
//   start() {
//     on<PlayerMoveArgs>(this.socket, ClientEvents.PlayerMove, ({index}) => {
//       this.playerMove(index);
//     });
//   }
//
//   playerMove(moveData: MoveData) {
//     const {index} = moveData;
//
//     GameModel.findById(this.id).then((game) => {
//       if (!game) {
//         return;
//       }
//
//       // new moveResponse(GameStatus.WAITING, game.board);
//
//       game.board[index] = Cell.WHITE;
//       const response: moveResponse = {
//         gameStatus: GameStatus.WAITING,
//         board: game.board,
//       };
//
//       game.save().then(() => {
//         console.log('player move');
//         console.log(this.id);
//         // emitEventInRoom(
//         //   this.id,
//         //   this.id,
//         //   JSON.stringify(response)
//         // );
//       });
//     });
//   }
// }
//
// export default BaseGame;
