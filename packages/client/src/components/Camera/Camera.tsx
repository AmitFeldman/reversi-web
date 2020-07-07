// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
import * as React from 'react';
import {extend, useFrame, useThree} from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {useEffect} from 'react';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({OrbitControls});

interface CameraControlsProps {
  controls: React.MutableRefObject<OrbitControls | undefined>;
  enabled?: boolean;
  topDown?: boolean;
  autoRotate?: boolean;
}

const MIN_DISTANCE = 10;
const MAX_DISTANCE = 20;
const AUTO_ROTATE_SPEED = 6;

const CameraControls: React.FC<CameraControlsProps> = ({
  controls,
  enabled = true,
  topDown = false,
  autoRotate = false,
}) => {
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

  useEffect(() => {
    if (controls.current) {
      controls.current.reset();
    }
  }, [topDown, autoRotate, enabled]);

  return (
    // @ts-ignore
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enabled={enabled}
      enableZoom={true}
      autoRotate={autoRotate}
      autoRotateSpeed={AUTO_ROTATE_SPEED}
      mouseButtons={{RIGHT: THREE.MOUSE.ROTATE}}
      enableKeys={false}
      enableDamping={true}
      dampingFactor={0.1}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      // Vertical
      maxPolarAngle={topDown ? Math.PI / 3 : Math.PI / 1.5}
      minPolarAngle={Math.PI / 4}
      // Horizontal
      maxAzimuthAngle={enabled ? Math.PI / 4 : Infinity}
      minAzimuthAngle={enabled ? -Math.PI / 4 : -Infinity}
    />
  );
};

export default CameraControls;
