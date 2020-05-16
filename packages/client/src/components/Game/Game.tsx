import * as React from 'react';
import {Canvas} from 'react-three-fiber';
import Board from '../Board/Board';
import CameraControls from '../Camera/Camera';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {IoMdReverseCamera} from 'react-icons/io';
import {TiArrowBack} from 'react-icons/ti';

const canvasStyle = {height: '100vh', background: 'beige'};

const Game: React.FC = () => {
  const controls = React.useRef<OrbitControls>();

  return (
    <>
      <Canvas
        style={canvasStyle}
        className="h-screen"
        onCreated={({gl, scene}) => {
          scene.rotation.set(Math.PI / 3, 0, 0);
        }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <CameraControls controls={controls} />

        <Board />
      </Canvas>

      <div className="absolute top-0 left-0">
        <div className="p-2">
          <button className="icon-btn">
            <TiArrowBack />
          </button>
        </div>

        <div className="p-2">
          <button
            onClick={() => controls.current && controls.current.reset()}
            className="icon-btn">
            <IoMdReverseCamera />
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-25">
        <h1>Black</h1>
      </div>

      <div className="absolute top-0 right-25">
        <h1>White</h1>
      </div>
    </>
  );
};
export default Game;
