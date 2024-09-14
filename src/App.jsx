import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Content from './components/Content';
import NoSignal from './components/NoSignal';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Content />} />
      <Route path="*" element={<NoSignal />} />
    </Routes>
  );
}

export default App;

