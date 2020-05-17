import * as React from 'react';
import {Canvas} from 'react-three-fiber';
import Board from '../Board/Board';

const canvasStyle = {height: '100vh', background: 'beige'};

const Game: React.FC = ({children}) => {
  return (
    <Canvas
      style={canvasStyle}
      className="h-screen"
      onCreated={({gl, scene}) => {
        scene.rotation.set(Math.PI / 3, 0, 0);
      }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Board />
      {children}
    </Canvas>
  );
};
export default Game;
