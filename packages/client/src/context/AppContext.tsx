import * as React from 'react';

export enum AppState {
  MAIN_MENU = 'MAIN_MENU',
  IN_GAME = 'IN_GAME',
}

interface AppContextData {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

const AppContext = React.createContext<AppContextData>({
  appState: AppState.MAIN_MENU,
  setAppState: () => {},
});

const AppDataProvider: React.FC = ({children}) => {
  const [appState, setAppState] = React.useState<AppState>(AppState.MAIN_MENU);

  return (
    <AppContext.Provider
      value={{
        appState: appState,
        setAppState: setAppState,
      }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppData = () => {
  const context = React.useContext(AppContext);

  if (context === undefined) {
    throw new Error(`useAppData must be used within a AppDataProvider`);
  }

  return context;
};

export {AppDataProvider, useAppData};
