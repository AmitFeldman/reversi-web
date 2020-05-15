import * as React from 'react';
import {Canvas} from 'react-three-fiber';
import Board from '../Board/Board';
import CameraControls from '../Camera/Camera';

const ThreeCanvas: React.FC = () => {
  return (
    <Canvas
      style={{height: '100vh', background: 'white'}}
      className='h-window'
      // camera={{position: [0, 0, 10], fov: 65}}
      onCreated={({gl, scene}) => {
        scene.rotation.set(Math.PI / 3, 0, 0);
      }}>
      <CameraControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Board position={[0, 0, 0]} />
    </Canvas>
  );
};

export default ThreeCanvas;
