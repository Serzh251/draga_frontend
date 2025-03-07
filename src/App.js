import React from 'react';
import MapComponent from './components/map/Map';
import 'leaflet/dist/leaflet.css';
import { useAuth } from './hook/use-auth';
import { Route, Routes } from 'react-router-dom';
import RouteLayout from './components/Header';

import './static/bootstrap/css/bootstrap.min.css';

const App = () => {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<RouteLayout isAuth={isAuth} />}>
        <Route index element={<MapComponent isAuth={isAuth} />} />
      </Route>
    </Routes>
  );
};

export default App;
