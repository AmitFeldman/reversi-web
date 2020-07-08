import * as React from 'react';

interface OptionsContextData {
  topDown: boolean;
  setTopDown: React.Dispatch<React.SetStateAction<boolean>>;
}

const OptionsContext = React.createContext<OptionsContextData>({
  topDown: false,
  setTopDown: () => {},
});

const OptionsProvider: React.FC = ({children}) => {
  const [topDown, setTopDown] = React.useState<boolean>(false);

  return (
    <OptionsContext.Provider
      value={{
        topDown,
        setTopDown,
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
