import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/base.css';
import './styles/app.css';
import './styles/films.css';
import './styles/advanced-scenes.css';
import './styles/equations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
