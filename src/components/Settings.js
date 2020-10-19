import React from 'react';
import '../styling/Homepage.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

import Profile from "./EditProfile";

function App() {
  return (
    <Router>
      <div className="container">
      <Route path="/Settings/Profile" component={Profile} />
      </div>
    </Router>
  );
}

export default App;
