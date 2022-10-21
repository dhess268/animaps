import { useState } from 'react';
import axios from 'axios';

export default function Landing() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const url = 'http://localhost:8000/auth/signin';
    axios
      .post(url, { username, password })
      .then((response) => {
        // shows the data returned in the payload for dev purposes
        console.log('login action', response.data);
        // sets token into local storage upon successful login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userID', response.data.userID);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
