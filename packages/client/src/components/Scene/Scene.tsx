import * as React from 'react';
import {Canvas} from 'react-three-fiber';

// Only way the canvas accepts styles
const canvasStyle = {height: '100vh', background: 'rebeccapurple'};

const Scene: React.FC = ({children}) => {
  return (
    <Canvas
      style={canvasStyle}
      className="h-screen z-0"
      pixelRatio={window.devicePixelRatio}
      onCreated={({gl, scene}) => {
        scene.rotation.set(Math.PI / 3, 0, 0);
      }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {children}
    </Canvas>
  );
};
export default Scene;
