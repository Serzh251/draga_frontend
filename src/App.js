import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MapComponent from './components/map/Map';
import 'leaflet/dist/leaflet.css';
import { useAuth } from "./hook/use-auth";
import { Route, Routes } from "react-router-dom";
import RouteLayout from "./components/Header";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";

const App = () => {
  const {isAuth} = useAuth();

  return (
    <Routes>
      <Route path="/" element={<RouteLayout isAuth={isAuth}/>}>
        <Route index element={<MapComponent/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="logout" element={<Logout/>}/>
      </Route>
    </Routes>
  );
};

export default App;