import * as React from 'react';
import {Vector3} from 'three';
import {PointerEvent} from 'react-three-fiber';

const FRAME_HEIGHT_ADDITION = 0.1;
const FRAME_SIZE = 0.25;

interface FrameProps {
  boardPosition: Vector3;
  boardSize: number;
  boardHeight: number;
}

const stopPropagationOnEvent = (e: PointerEvent) => {
  e.stopPropagation();
};

const BlockEventsProps = {
  onClick: stopPropagationOnEvent,
  onPointerOver: stopPropagationOnEvent,
  onPointerOut: stopPropagationOnEvent,
};

// boardPosition - position sent to board mesh (not grid)
// boardSize - Length of one side of board
// boardHeight - length of height of board
const Frame: React.FC<FrameProps> = ({
  boardPosition,
  boardSize,
  boardHeight,
}) => {
  const frameHeight = boardHeight + FRAME_HEIGHT_ADDITION;

  return (
    <>
      {/*LEFT*/}
      <mesh
        {...BlockEventsProps}
        position={
          new Vector3(
            boardPosition.x - boardSize / 2 - FRAME_SIZE / 2,
            boardPosition.y,
            boardPosition.z
          )
        }>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE, frameHeight, boardSize + FRAME_SIZE * 2]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*TOP*/}
      <mesh
        {...BlockEventsProps}
        position={
          new Vector3(
            boardPosition.x,
            boardPosition.y,
            boardPosition.z - boardSize / 2 - FRAME_SIZE / 2
          )
        }>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE * 2 + boardSize, frameHeight, FRAME_SIZE]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*BOTTOM*/}
      <mesh
        {...BlockEventsProps}
        position={
          new Vector3(
            boardPosition.x,
            boardPosition.y,
            boardPosition.z + boardSize / 2 + FRAME_SIZE / 2
          )
        }>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE * 2 + boardSize, frameHeight, FRAME_SIZE]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      {/*RIGHT*/}
      <mesh
        {...BlockEventsProps}
        position={
          new Vector3(
            boardPosition.x + boardSize / 2 + FRAME_SIZE / 2,
            boardPosition.y,
            boardPosition.z
          )
        }>
        <boxBufferGeometry
          attach="geometry"
          args={[FRAME_SIZE, frameHeight, boardSize + FRAME_SIZE * 2]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
    </>
  );
};

export default Frame;
