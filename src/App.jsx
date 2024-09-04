// src/App.jsx
import React, { useState } from 'react';
import './styles/App.css';
import VHSIntro from './components/VHSIntro';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <VHSIntro onEnd={() => setShowIntro(false)} />
      ) : (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;

