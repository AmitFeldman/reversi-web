// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
import * as React from 'react';
import {extend, useFrame, useThree} from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({OrbitControls});

interface CameraControlsProps {
  controls: React.MutableRefObject<OrbitControls | undefined>;
}

const CameraControls: React.FC<CameraControlsProps> = ({controls}) => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: {domElement},
  } = useThree();

  useFrame((state) => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    // @ts-ignore
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      minDistance={10}
      maxDistance={20}
      mouseButtons={{RIGHT: THREE.MOUSE.ROTATE}}
      maxAzimuthAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.5}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={Math.PI / 4}
      enableDamping={true}
      dampingFactor={0.1}
      enableKeys={false}
    />
  );
};

export default CameraControls;
