import './App.css';
import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

// Lazy route imports
const Login = React.lazy(() => import('./components/Login/Login'));
const Register = React.lazy(() => import('./components/Register/Register'));
const Error = React.lazy(() => import('./components/Error/Error'));
const ThreeCanvas = React.lazy(() => import('./components/ThreeCanvas/ThreeCanvas'));

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/demo" component={ThreeCanvas} />
          <Route path="/register" component={Register} />
          <Route path="/error" component={Error} />

          <Redirect from="*" to="/error" />
        </Switch>
      </React.Suspense>
    </div>
  );
}

export default App;
