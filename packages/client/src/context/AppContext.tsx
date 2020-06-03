import * as React from 'react';

export enum AppState {
  MAIN_MENU = 'MAIN_MENU',
  IN_GAME = 'IN_GAME',
}

interface AppContextData {
  state: AppState;
  setStateMainMenu: () => void;
  setStateInGame: () => void;
}

const AppContext = React.createContext<AppContextData>({
  state: AppState.MAIN_MENU,
  setStateMainMenu: () => {},
  setStateInGame: () => {},
});

const AppDataProvider: React.FC = ({children}) => {
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);

  return (
    <AppContext.Provider
      value={{
        state,
        setStateInGame: () => setState(AppState.IN_GAME),
        setStateMainMenu: () => setState(AppState.MAIN_MENU),
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
