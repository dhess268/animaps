import Autocomplete from 'react-google-autocomplete';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [place, setPlace] = useState('');
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [inputError, setInputError] = useState('');

  const navigate = useNavigate();

  function handlePlaceSelected(selectedPlace) {
    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();
    // console.log(selectedPlace);
    setPlace({ lat, lng });
    setAutocompleteInput(selectedPlace.formatted_address);
  }

  function checkInputs() {
    if ((username, password, email, first, last, place, autocompleteInput)) {
      return true;
    }
    setInputError('All fields must be filled out in order to register');
    return false;
  }

  function handleRegister(e) {
    e.preventDefault();
    if (!checkInputs()) {
      return;
    }
    const data = {
      username,
      password,
      email,
      firstname: first,
      lastname: last,
      addressString: autocompleteInput,
      addressLatLng: place,
    };
    axios
      .post('https://animaps-production.up.railway.app/user', data)
      .then((response) => {
        // console.log('fetchuseraction', response.data);
        const url = 'https://animaps-production.up.railway.app/auth/signin';
        axios
          .post(url, { username, password })
          .then((res) => {
            // shows the data returned in the payload for dev purposes
            // console.log('login action', res.data);
            // sets token into local storage upon successful login
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userID', res.data.userID);
            navigate('/profile');
          })
          .catch((error) => {
            alert('error: please try logging in with your new account');
            navigate('/login');
          });
      })
      .catch((error) => {
        alert('Error: Please try again');
        navigate('/register');
      });
  }

  return (
    <section className="landing">
      <h1 className="text-center mb-5 pt-5">Register for Animaps</h1>
      <form
        className="form__register col-md-8 offset-md-2"
        onSubmit={(e) => handleRegister(e)}
      >
        <label htmlFor="username">username</label>
        <input
          type="text"
          placeholder="username"
          name="username"
          className="mb-3"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
          className="mb-3"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label htmlFor="email">email</label>
        <input
          type="text"
          placeholder="email"
          name="email"
          className="mb-3"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          placeholder="First name"
          name="firstName"
          className="mb-3"
          onChange={(e) => setFirst(e.target.value)}
          value={first}
        />
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          placeholder="Last name"
          name="lastName"
          className="mb-3"
          onChange={(e) => setLast(e.target.value)}
          value={last}
        />
        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A}
          placeholder="Home Address"
          onPlaceSelected={(selected) => {
            handlePlaceSelected(selected);
          }}
          options={{
            types: ['address'],
          }}
          value={autocompleteInput}
          onChange={(e) => setAutocompleteInput(e.target.value)}
        />

        <button type="submit" className="mt-4 btn btn-success">
          Register
        </button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="col-md-8 offset-md-2 mt-4 btn btn-primary"
      >
        Back to login
      </button>
    </section>
  );
}
