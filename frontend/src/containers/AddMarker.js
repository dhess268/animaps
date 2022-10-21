import { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

export default function AddMarker() {
  const [place, setPlace] = useState({ lat: null, lng: null });
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  function handlePlaceSelected(selectedPlace) {
    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();
    setPlace({ lat, lng });
  }

  function verifyInputs(enteredPlace, enteredSpecies, enteredDescription) {
    if (
      enteredPlace.lat &&
      enteredPlace.lng &&
      enteredSpecies &&
      enteredDescription
    ) {
      return true;
    }
    return false;
  }
  function handleReport(e) {
    e.preventDefault();
    if (verifyInputs(place, species, description)) {
      console.table({
        lat: place.lat,
        lng: place.lng,
        species,
        description,
      });
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="form__container" onSubmit={(e) => handleReport(e)}>
      <h2>Report an animal sighting</h2>
      <form className="form__inner">
        <p>
          <label htmlFor="species" className="form__label">
            Species
          </label>
          <select
            name="pets"
            id="pet-select"
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option value="">--Please choose an option--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
        </p>
        <p>
          <label htmlFor="description" className="form__label">
            Description of animal
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </p>

        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A}
          placeholder={`${
            capitalizeFirstLetter(species) || 'Animal'
          } sighting location`}
          onPlaceSelected={(selected) => {
            handlePlaceSelected(selected);
          }}
          options={{
            types: 'address',
          }}
        />
        <button type="submit">Report</button>
      </form>
    </div>
  );
}
