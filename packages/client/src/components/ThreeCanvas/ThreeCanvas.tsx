import * as React from 'react';
import {Canvas} from 'react-three-fiber';
import Board from '../Board/Board';
import CameraControls from '../Camera/Camera';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {IoMdReverseCamera} from 'react-icons/io';
import {TiArrowBack} from 'react-icons/ti';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const ThreeCanvas: React.FC = () => {
  const controls = React.useRef<OrbitControls>();

  return (
    <>
      <Canvas
        style={{height: '100vh', background: 'white'}}
        className="h-window"
        onCreated={({gl, scene}) => {
          scene.rotation.set(Math.PI / 3, 0, 0);
        }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <CameraControls controls={controls} />

        <Board />
      </Canvas>

      <div className="hud top-left">
        <Tooltip title="Leave Game">
          <IconButton>
            <TiArrowBack />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Camera">
          <IconButton
            onClick={() => controls.current && controls.current.reset()}>
            <IoMdReverseCamera />
          </IconButton>
        </Tooltip>
      </div>

      <div className="hud mid-left">
        <h1>Black</h1>
      </div>

      <div className="hud mid-right">
        <h1>White</h1>
      </div>
    </>
  );
};
export default ThreeCanvas;
