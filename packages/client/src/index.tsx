import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from './context/AuthContext';
import {OptionsProvider} from './context/OptionsContext';
import {CameraProvider} from './context/CameraContext';
import {GameManagerProvider} from './context/GameManagerContext';

const ContextProviders: React.FC = ({children}) => {
  return (
    <AuthProvider>
      <CameraProvider>
        <OptionsProvider>
          <GameManagerProvider>{children}</GameManagerProvider>
        </OptionsProvider>
      </CameraProvider>
    </AuthProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ContextProviders>
      <App />
    </ContextProviders>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
