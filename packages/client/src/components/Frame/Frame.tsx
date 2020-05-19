import * as React from 'react';
import {Vector3} from 'three';
import {PointerEvent} from 'react-three-fiber';
import {
  BOARD_HEIGHT,
  BOARD_POSITION,
  BOARD_SIZE,
  PositionArray,
} from '../../constants/game-constants';

const FRAME_HEIGHT_ADDITION = 0.1;
const FRAME_SIZE = 0.25;

const stopPropagationOnEvent = (e: PointerEvent) => {
  e.stopPropagation();
};

const BlockEventsProps = {
  onClick: stopPropagationOnEvent,
  onPointerOver: stopPropagationOnEvent,
  onPointerOut: stopPropagationOnEvent,
};

const Frame: React.FC = () => {
  const frameHeight = BOARD_HEIGHT + FRAME_HEIGHT_ADDITION;
  const vector = new Vector3(...BOARD_POSITION);

  const LEFT_FRAME_POSITION: PositionArray = [
    vector.x - BOARD_SIZE / 2 - FRAME_SIZE / 2,
    vector.y,
    vector.z,
  ];

  const TOP_FRAME_POSITION: PositionArray = [
    vector.x,
    vector.y,
    vector.z - BOARD_SIZE / 2 - FRAME_SIZE / 2,
  ];

  const BOTTOM_FRAME_POSITION: PositionArray = [
    vector.x,
    vector.y,
    vector.z + BOARD_SIZE / 2 + FRAME_SIZE / 2,
  ];

  const RIGHT_FRAME_POSITION: PositionArray = [
    vector.x + BOARD_SIZE / 2 + FRAME_SIZE / 2,
    vector.y,
    vector.z,
  ];

  return (
    <>
      {/*LEFT*/}
      <mesh {...BlockEventsProps} position={LEFT_FRAME_POSITION}>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE, frameHeight, BOARD_SIZE + FRAME_SIZE * 2]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*TOP*/}
      <mesh {...BlockEventsProps} position={TOP_FRAME_POSITION}>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE * 2 + BOARD_SIZE, frameHeight, FRAME_SIZE]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*BOTTOM*/}
      <mesh {...BlockEventsProps} position={BOTTOM_FRAME_POSITION}>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE * 2 + BOARD_SIZE, frameHeight, FRAME_SIZE]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*RIGHT*/}
      <mesh {...BlockEventsProps} position={RIGHT_FRAME_POSITION}>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE, frameHeight, BOARD_SIZE + FRAME_SIZE * 2]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
    </>
  );
};

export default Frame;
