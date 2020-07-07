import * as React from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

interface OptionsContextData {
  controls: React.MutableRefObject<OrbitControls | undefined>;
  resetCamera: () => void;
}

const OptionsContext = React.createContext<OptionsContextData>({
  controls: {current: undefined},
  resetCamera: () => {},
});

const OptionsProvider: React.FC = ({children}) => {
  const controls = React.useRef<OrbitControls>();

  return (
    <OptionsContext.Provider
      value={{
        controls,
        resetCamera: () => controls.current && controls.current.reset(),
      }}>
      {children}
    </OptionsContext.Provider>
  );
};

const useOptions = () => {
  const context = React.useContext(OptionsContext);

  if (context === undefined) {
    throw new Error(`useOptions must be used within a OptionsProvider`);
  }

  return context;
};

export {OptionsProvider, useOptions};
