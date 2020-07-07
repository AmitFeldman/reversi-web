import * as React from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

interface CameraContextData {
  controls: React.MutableRefObject<OrbitControls | undefined>;
  resetCamera: () => void;
}

const CameraContext = React.createContext<CameraContextData>({
  controls: {current: undefined},
  resetCamera: () => {},
});

const CameraProvider: React.FC = ({children}) => {
  const controls = React.useRef<OrbitControls>();

  return (
    <CameraContext.Provider
      value={{
        controls,
        resetCamera: () => controls.current && controls.current.reset(),
      }}>
      {children}
    </CameraContext.Provider>
  );
};

const useCamera = () => {
  const context = React.useContext(CameraContext);

  if (context === undefined) {
    throw new Error(`useCamera must be used within a CameraProvider`);
  }

  return context;
};

export {CameraProvider, useCamera};
