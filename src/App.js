import React from 'react';
import HttpsRedirect from 'react-https-redirect';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SirJava from './SirJava.jsx';

function App() {
  return (
    <div>
      <HttpsRedirect>
        <Router>
          <Route exact path="/" component={SirJava} />
          <Route exact path="/:action" component={SirJava} />
        </Router>
      </HttpsRedirect>
    </div>
  );
}

export default App;
