import React from 'react';
import HttpsRedirect from 'react-https-redirect';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as eng from './providers/engine';

import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Esoko from './Esoko.jsx';

function App() {
  if(eng.getStorage('userToken')) {
    return (
      <div>
        <HttpsRedirect>
          <Router>
            <Route exact path="/" component={Esoko} />
            <Route exact path="/:action" component={Esoko} />
          </Router>
        </HttpsRedirect>
      </div>
    );
  }else{
    let route = eng.getStorageJson('route');
    let action = route.action || '';
    if(eng.inArray(action, ['','login','register']) === true) {
      return (
        <div>
          <HttpsRedirect>
            <Router>
              <Route exact path="/" component={Login} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Router>
          </HttpsRedirect>
        </div>
      );
    }else{
      eng.setStorageJson('route', {"action":"login"});
      eng.redirect('/login');
    }
  }
}

export default App;
