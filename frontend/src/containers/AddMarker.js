import { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

export default function AddMarker() {
  const [place, setPlace] = useState({ lat: 0, lng: 0 });

  function handlePlaceSelected(selectedPlace) {
    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();
    setPlace({ lat, lng });
  }
  return (
    <div className="form__container">
      <h2>Report an animal sighting</h2>
      <form className="form__inner">
        <p>
          <label htmlFor="species">Species</label>
          <input name="species" />
        </p>
        <p>
          <label htmlFor="description">Species</label>
          <textarea name="description" />
        </p>

        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A}
          onPlaceSelected={(selected) => {
            handlePlaceSelected(selected);
          }}
        />
        <button type="submit">Report</button>
      </form>
    </div>
  );
}
