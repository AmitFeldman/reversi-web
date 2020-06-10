import React from 'react';
import Scene from './components/Scene/Scene';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from './components/Camera/Camera';
import {AppState} from './context/AppContext';
import Board from './components/Board/Board';
import Modal from 'react-modal';
import HeadsUpDisplay from './components/HeadsUpDisplay/HeadsUpDisplay';
import CellLayer from './components/CellsLayer/CellsLayer';
import DiscLayer from './components/DiscsLayer/DiscLayer';
import {CellState} from './components/Cell/Cell';
import {DiscType} from './components/Disc/Disc';
import {emitEvent, onSocketEvent} from './utils/socket-client';
import {useAuth} from './context/AuthContext';

enum ClientEvents {
  CreateRoom = 'CREATE_ROOM',
  Ready = 'READY',
  PlayerMove = 'PLAYER_MOVE',
}

enum ServerEvents {
  CreatedRoom = 'CREATED_ROOM',
  GameUpdated = 'GAME_UPDATE'
}

enum CurrentTurn {
  WHITE = 'WHITE',
  BLACK = 'BLACK'
}

function App() {
  const controls = React.useRef<OrbitControls>();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);
  const [turn, setTurn] = React.useState<DiscType>(CellState.WHITE);
  const [board, setBoard] = React.useState<CellState[]>(
    new Array(64).fill(CellState.EMPTY)
  );
  const {user} = useAuth();

  const [roomId, setRoomId] = React.useState<string>("");

  React.useEffect(() => {
    onSocketEvent(ServerEvents.CreatedRoom, (roomId: string) => {
      setRoomId(roomId);
    });

    onSocketEvent(ServerEvents.GameUpdated, (data: any) => {
      setRoomId(data._id);
      setBoard(data.board);
      setTurn(data.turn === CurrentTurn.WHITE ? CellState.WHITE : CellState.BLACK);
    });

    // emitEvent('createRoom', {token: user._id, gameType: 'AI_EASY'});
  }, []);

  // Reset Camera when going into game
  React.useEffect(() => {
    if (state === AppState.IN_GAME) {
      controls.current && controls.current.reset();
    }
  }, [state]);

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <>
      <Scene>
        <CameraControls controls={controls} state={state} />
        <Board />

        <CellLayer
          disabled={state === AppState.MAIN_MENU}
          cells={board}
          onCellClick={(index) => {
            emitEvent(ClientEvents.PlayerMove, {token: user?._id, roomId, moveId: index});
          }}
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay
        scoreBlack={board.filter((state) => state === CellState.BLACK).length}
        scoreWhite={board.filter((state) => state === CellState.WHITE).length}
        turn={turn}
        appState={state}
        setAppState={(state) => setState(state)}
        cameraControls={controls.current}
      />
    </>
  );
}

export default App;
