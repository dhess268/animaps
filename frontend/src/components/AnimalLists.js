import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import haversine from 'haversine-distance';
import { ThreeCircles } from 'react-loader-spinner';

const defaultLatLng = {
  lat: 40.7128,
  lng: -74.006,
};

export default function AnimalList() {
  const navigate = useNavigate();
  const [markerData, setMarkerData] = useState('');
  const [maxDistanceInMiles, setMaxDistanceInMiles] = useState(50);
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [sortDistanceBy, setSortDistanceBy] = useState(-1);
  // must get user data and marker data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('https://animaps-production.up.railway.app/auth/current_user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          const user = response.data;
          // note: move this out of the useEffect intoa usecallback later...
          axios
            .get('https://animaps-production.up.railway.app/markers')
            .then((serverData) => {
              const newMarkers = serverData.data.map((marker) => ({
                ...marker,
                distanceFromCenter: (
                  haversine(user.addressLatLng, {
                    lat: marker.lat,
                    lng: marker.lng,
                  }) / 1609
                ).toFixed(1),
              }));
              setMarkerData(newMarkers);
            });
        })
        .catch((error) => {
          localStorage.clear();
          navigate('/login');
        });
    } else {
      // navigate('/');
      axios
        .get('https://animaps-production.up.railway.app/markers')
        .then((serverData) => {
          const newMarkers = serverData.data.map((marker) => ({
            ...marker,
            distanceFromCenter: (
              haversine(defaultLatLng, {
                lat: marker.lat,
                lng: marker.lng,
              }) / 1609
            ).toFixed(1),
          }));
          setMarkerData(newMarkers);
        });
    }
  }, [navigate]);

  function renderCards() {
    const filteredMarkers = markerData
      .filter(
        (marker) => marker.distanceFromCenter < Number(maxDistanceInMiles)
      )
      .filter((marker) => marker.species.includes(selectedSpecies));

    const sortedAndFilteredMarkers = filteredMarkers.sort(
      (a, b) =>
        ((b.distanceFromCenter || Number.MAX_VALUE) -
          (a.distanceFromCenter || Number.MAX_VALUE)) *
        sortDistanceBy
    );

    const cardsToDisplay = sortedAndFilteredMarkers.map((marker) => (
      <div className="col d-flex align-items-stretch" key={marker._id + 10}>
        <div className="card">
          <img
            src={marker.image.url}
            className="card-img-top card-img"
            alt={marker.species}
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
    return cardsToDisplay.length > 0 ? (
      cardsToDisplay
    ) : (
      <div className="col-md-6 offset-md-3 mt-5">
        <p>
          There are currently no animal sightings within your selected distance
          from you! Go to the map page to add some!
        </p>
      </div>
    );
  }

  return markerData ? (
    <div className="mar">
      <div className="col-md-8 offset-md-2">
        <div className="row mb-4">
          <section className="mb-2">
            <label htmlFor="species" className="form__label col-md-2">
              <strong>Sort By Animal Type</strong>
            </label>
            <select
              name="pets"
              id="pet-select"
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="col-md-3"
              defaultValue=""
            >
              <option value="">--All--</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="hamster">Hamster</option>
              <option value="parrot">Parrot</option>
              <option value="spider">Spider</option>
              <option value="goldfish">Goldfish</option>
            </select>
          </section>

          <section className="mb-2">
            <label htmlFor="distance" className="form__label col-md-2">
              <strong>Set Max Distance</strong>
            </label>
            <select
              name="distance"
              id="distance-select"
              onChange={(e) => setMaxDistanceInMiles(e.target.value)}
              className="col-md-3"
              defaultValue="50"
            >
              <option value="1">1 mile</option>
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="30">30 miles</option>
              <option value="50">50 miles</option>
              <option value="100000">100000 miles</option>
            </select>
          </section>
          <section>
            <label htmlFor="sort-by" className="form__label col-md-2">
              <strong>Sort Distance By</strong>
            </label>
            <select
              name="sort-by"
              id="distance-sort-by"
              onChange={(e) => setSortDistanceBy(e.target.value)}
              className="col-md-3"
              defaultValue="-1"
            >
              <option value="-1">Closest</option>
              <option value="1">Farthest</option>
            </select>
          </section>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">{renderCards()}</div>
      </div>
    </div>
  ) : (
    <ThreeCircles
      height="100"
      width="100"
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass="loading__center"
      visible
      ariaLabel="three-circles-rotating"
      outerCircleColor=""
      innerCircleColor=""
      middleCircleColor=""
    />
  );
}
