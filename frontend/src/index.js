import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import App from './App';
import Landing from './containers/Landing';
import ErrorPage from './ErrorPage';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Profile from './components/Profile';
import AnimalList from './components/AnimalLists';
import HeaderTest from './components/HeaderTest';
import Register from './components/Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* hash router used for github pages compatab */}
    <HashRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route
            element={
              <>
                <HeaderTest />
                <Outlet />
              </>
            }
          >
            <Route path="/map" element={<App />} />
            <Route exact path="/login" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sightings" element={<AnimalList />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
