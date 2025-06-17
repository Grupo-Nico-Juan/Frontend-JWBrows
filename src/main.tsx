import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TurnoProvider } from "./context/TurnoContext";
import './index.css';


const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No root element found');

ReactDOM.createRoot(rootElement).render(
  
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TurnoProvider>
          <App />
        </TurnoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
