import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from './context/AuthContext';
import {AppDataProvider} from './context/AppContext';
import {OptionsProvider} from './context/OptionsContext';
import {CameraProvider} from './context/CameraContext';

const ContextProviders: React.FC = ({children}) => {
  return (
    <AuthProvider>
      <AppDataProvider>
        <CameraProvider>
          <OptionsProvider>{children}</OptionsProvider>
        </CameraProvider>
      </AppDataProvider>
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
