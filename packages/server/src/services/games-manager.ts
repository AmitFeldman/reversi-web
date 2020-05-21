import BaseGame from './base-game';
import {onConnect} from '../utils/socket-service';
import {CreateRoomArgs, UserEvents} from '../types/events';
import CpuGame from './cpu-game';

const games: BaseGame[] = [];

const initGamesManager = () => {
  onConnect((socket) => {
    socket.on(UserEvents.CreateRoom, async ({settings}: CreateRoomArgs) => {
      const type = 'AI_EASY';
      const game = new CpuGame(socket, type);

      games.push(game);

      await game.init();

      game.start();

      // // Add user to game room by id
      // this.socket.join(this.id);
      // this.socket.emit(ServerEvents.CreatedRoom, this.id);
      //
      // this.socket.on("READY", () => {
      //   StartGame();
      //
      //   this.socket.on('playerMove', (moveData: string) => {
      //     console.log('PLAYER MOVEEEEEEE');
      //     console.log(moveData);
      //     this.playerMove(JSON.parse(moveData) as MoveData);
      //   });
      // });
    });
  });
};

export {initGamesManager};
