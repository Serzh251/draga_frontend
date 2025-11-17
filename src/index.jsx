import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/css/index.css';
import './static/css/App.css';
import 'leaflet/dist/leaflet.css';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import '@ant-design/v5-patch-for-react-19';
import App from './App';
import ResponsiveProvider from '@/components/ResponsiveProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ResponsiveProvider>
        <App />
      </ResponsiveProvider>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
