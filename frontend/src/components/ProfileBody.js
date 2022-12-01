import Autocomplete from 'react-google-autocomplete';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileBody({ user }) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [place, setPlace] = useState(user.addressLatLng);
  const [autocompleteInput, setAutocompleteInput] = useState(
    user.addressString
  );
  const [firstName, setFirstName] = useState(user.firstname);
  const [lastName, setLastName] = useState(user.lastname);

  function handleEditClick() {
    setIsEditing(true);
  }
  function handleEditEnd() {
    setIsEditing(false);
  }

  function handlePlaceSelected(selectedPlace) {
    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();
    // console.log(selectedPlace);
    setPlace({ lat, lng });
    setAutocompleteInput(selectedPlace.formatted_address);
  }

  function handleProfileSave() {
    const token = localStorage.getItem('token');
    const editedUser = {
      firstname: firstName,
      lastname: lastName,
      addressLatLng: place,
      addressString: autocompleteInput,
    };
    axios
      .put(
        'https://animaps-production.up.railway.app/user/edit',
        { headers: { Authorization: `Bearer ${token}` } },
        editedUser
      )
      .catch((error) => {
        console.log(error);
        alert('Error: Please try again');
        navigate('/profile');
      });
  }

  return !isEditing ? (
    <section className="profile__section">
      <section className="profile__inner">
        <h1>My Personal Info</h1>
        <section className="profile__info">
          <span className="profile__line">
            <strong className="profile__name">Name: </strong>
            {user.firstname} {user.lastname}
          </span>
          <br />
          <span className="profile__line">
            <strong>Address: </strong>
            {user.addressString}
          </span>
          <br />
          <span className="profile__line">
            <strong className="profile__email">Email: </strong>
            {user.email}
          </span>
        </section>
        <br />
        <button
          type="button"
          className="btn btn-success"
          onClick={() => handleEditClick()}
        >
          Edit
        </button>
        <section />
      </section>
    </section>
  ) : (
    <section className="profile__section">
      <section className="profile__inner">
        <h1>My Personal Info</h1>
        <section className="profile__info">
          <span className="profile__line">
            <strong>
              <label className="" name="first">
                First Name:{' '}
              </label>
            </strong>

            <input
              type="text"
              name="first"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </span>
          <br />
          <span className="profile__line">
            <strong>
              <label className="last" name="last">
                Last Name:{' '}
              </label>
            </strong>

            <input
              type="text"
              name="last"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </span>
          <br />
          <span className="profile__line">
            <strong className="profile__address-input">Address: </strong>
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
          </span>
          <br />
          <span className="profile__line">
            <strong className="profile__email">Email: </strong>
            {user.email}
          </span>
        </section>
        <br />
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleEditEnd()}
        >
          Cancel
        </button>
        <br />

        <button
          type="button"
          className="btn btn-success"
          onClick={() => handleProfileSave()}
        >
          Save
        </button>

        <section />
      </section>
    </section>
  );
}
ProfileBody.propTypes = {
  user: PropTypes.object,
};

// username
// NO password lol
// addressString
//  firstname
//  lastname
//  email
//
//
//
//
//
