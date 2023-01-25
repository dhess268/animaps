import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import Profile from './components/Profile';
import AnimalList from './components/AnimalLists';
import HeaderTest from './components/HeaderTest';
import Register from './components/Register';
import Login from './containers/Login';
import Landing from './components/Landing';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* hash router used for github pages compatab */}
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeaderTest />
              <Outlet />
            </>
          }
        >
          <Route index element={<Landing />} />
          <Route path="/map" element={<App />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sightings" element={<AnimalList />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
