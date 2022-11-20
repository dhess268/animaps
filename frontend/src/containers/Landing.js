import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const logo = require('../pics/ANIMAPS_large.png');

export default function Landing() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorToShow, setErrorToShow] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('https://animaps-production.up.railway.app/auth/current_user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('fetchuseraction', response.data);
          localStorage.setItem('token', response.data.token);
          navigate('/map');
        })
        .catch((error) => {
          localStorage.clear();
        });
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const url = 'https://animaps-production.up.railway.app/auth/signin';
    axios
      .post(url, { username, password })
      .then((response) => {
        // shows the data returned in the payload for dev purposes
        console.log('login action', response.data);
        // sets token into local storage upon successful login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userID', response.data.userID);
        navigate('/map');
      })
      .catch((error) => {
        setErrorToShow(error);
        setUsername('');
        setPassword('');
      });
  }
  return (
    <div className="d-flex justify-content-space-around flex-column h-100">
      {/* <h1 className="text-center mb-5 logo">Animaps</h1> */}
      <img src={logo} alt="logo" width={400} className="align-self-center" />
      <form onSubmit={(e) => handleSubmit(e)} className="d-grid gap-3">
        <div className="col-md-4 offset-md-4">
          <input
            type="name"
            id="form2Example1"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Username"
          />
        </div>

        <div className="col-md-4 offset-md-4">
          <input
            type="password"
            id="form2Example2"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
        </div>

        <button type="submit" className="btn btn-primary col-md-2 offset-md-5">
          Sign in
        </button>
        <p className="col-md-2 offset-md-5">
          No account? click <a href="/animaps#/register">here</a> to register!
        </p>
        {errorToShow ? (
          <div className="col-md-4 offset-md-4 text-center border border-2 rounded bg-light border-danger mar">
            Incorrect username or password please try again.
          </div>
        ) : null}
      </form>
    </div>
  );
}
