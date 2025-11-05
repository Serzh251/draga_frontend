// App.jsx
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import RouteLayout from './components/Header';
import MapComponent from './components/map/Map';
import 'leaflet/dist/leaflet.css';
import './static/bootstrap/css/bootstrap.min.css';
import { useAuth } from '@/hooks/useAuth';

const App = () => {
  const { isAuth } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<RouteLayout isAuth={isAuth} />}>
          <Route index element={<MapComponent />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
