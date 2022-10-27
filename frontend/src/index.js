import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Landing from './containers/Landing';
import ErrorPage from './ErrorPage';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Profile from './components/Profile';
import AnimalList from './components/AnimalLists';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<App />} />
        <Route exact path="/login" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listings" element={<AnimalList />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
