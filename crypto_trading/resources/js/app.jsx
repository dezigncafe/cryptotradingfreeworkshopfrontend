import './bootstrap';
import '../css/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRouter from './AppRouter';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('React root element was not found.');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </React.StrictMode>,
);