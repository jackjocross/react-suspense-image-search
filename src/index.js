import React from 'react';
import { unstable_createRoot as createRoot } from 'react-dom';
import { Router } from 'router-suspense';
import App from './App';

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
