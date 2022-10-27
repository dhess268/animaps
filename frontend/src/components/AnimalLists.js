import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import haversine from 'haversine-distance';
import ListingHeader from './ListingHeader';

export default function AnimalList() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  const [markerData, setMarkerData] = useState('');
  const [sortedByDistance, setSortedByDistance] = useState('');

  // must get user data and marker data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/auth/current_user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          setUserData(response.data);
        })
        .catch((error) => {
          localStorage.clear();
          navigate('/login');
        });
      axios
        .get('/markers')
        .then((serverData) => setMarkerData(serverData.data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && markerData) {
      const newMarkers = markerData.map((marker) => ({
        ...marker,
        distanceFromCenter: (
          haversine(userData.addressLatLng, {
            lat: marker.lat,
            lng: marker.lng,
          }) / 1609
        ).toFixed(1),
      }));
      const sortedByDistanceMarkers = newMarkers.sort(
        (a, b) => a.distanceFromCenter - b.distanceFromCenter
      );
      setSortedByDistance(sortedByDistanceMarkers);
    }
  }, [markerData, userData]);

  function sortByDistance(arrayOfThingsToSort) {
    const newMarkers = arrayOfThingsToSort.map((marker) => ({
      ...marker,
      distanceFromCenter: (
        haversine(userData.addressLatLng, {
          lat: marker.lat,
          lng: marker.lng,
        }) / 1609
      ).toFixed(1),
    }));
    const sortedByDistanceMarkers = newMarkers.sort(
      (a, b) => a.distanceFromCenter - b.distanceFromCenter
    );
    return sortedByDistanceMarkers;
  }

  function handlePetSelect(e) {
    console.log(e.target.value);
    if (e.target.value) {
      sortByPetType(e.target.value);
    } else {
      setSortedByDistance(sortByDistance(markerData));
    }
  }

  function sortByPetType(species) {
    const sortedByAnimal = markerData.filter(
      (marker) => marker.species === species
    );

    setSortedByDistance(sortByDistance(sortedByAnimal));
  }

  function renderCards() {
    const cards = sortedByDistance.map((marker) => (
      <div className="col d-flex align-items-stretch" key={marker._id + 10}>
        <div className="card">
          <img
            src={marker.image.url}
            className="card-img-top card-img"
            alt="..."
          />
          <div className="card-body">
            <h3 className="card-title">
              {marker.species} seen on {marker.time}
            </h3>
            <span>Location: {marker.addressString}</span>
            <br />
            <span>{marker.distanceFromCenter} miles away</span>
            <p className="card-text">
              <b>User description of the animal sighting:</b>{' '}
              {marker.description}
            </p>
          </div>
        </div>
      </div>
    ));
    return cards;
  }

  return userData && sortedByDistance ? (
    <div>
      <ListingHeader username={userData.username} />
      <div className="col-md-8 offset-md-2">
        <div className="row">
          <label htmlFor="species" className="form__label col-md-2">
            Sort by Animal Type
          </label>
          <select
            name="pets"
            id="pet-select"
            onChange={(e) => handlePetSelect(e)}
            className="col-md-3"
          >
            <option value="">--All--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">{renderCards()}</div>
      </div>
    </div>
  ) : (
    <div>
      <ListingHeader username="..." />
      loading...
    </div>
  );
}
