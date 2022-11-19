import { useState } from 'react';
import PropTypes from 'prop-types';
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from 'react-google-places-autocomplete';

export default function AddMarker({ addMarker, latLng }) {
  const [place, setPlace] = useState({ lat: null, lng: null });
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [fileInput, setFileInput] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [previewSource, setPreviewSource] = useState('');

  function handlePlaceSelected(selectedPlace) {
    // const lat = selectedPlace.geometry.location.lat();
    // const lng = selectedPlace.geometry.location.lng();
    // console.log(selectedPlace);
    // setPlace({ lat, lng });
    // setAutocompleteInput(selectedPlace.formatted_address);

    geocodeByPlaceId(selectedPlace.value.place_id)
      .then((results) => {
        console.log(results);
        if (results.length > 0) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          console.log(results);
          setPlace({ lat, lng });
        }
      })
      .catch((error) => console.error(error));
  }

  function verifyInputs(enteredPlace, enteredSpecies, enteredDescription) {
    if (
      enteredPlace.lat &&
      enteredPlace.lng &&
      enteredSpecies &&
      enteredDescription &&
      selectedFile
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
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        addMarker({
          lat: place.lat,
          lng: place.lng,
          species,
          description,
          image: reader.result,
          addressString: autocompleteInput,
        });
      };
      reader.onerror = () => {
        console.error('something went wrong!');
      };

      setSpecies('');
      setDescription('');
      setPlace({ lat: null, lng: null });
      setAutocompleteInput('');
      setFileInput('');
      setPreviewSource('');
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleInputchange(event) {
    // allows site to not crash when the user doesn't select any picture
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      previewFile(file);
      setSelectedFile(file);
      setFileInput(event.target.value);
    } else {
      setSelectedFile('');
      setFileInput('');
      setPreviewSource('');
    }
  }

  function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  }
  // console.log(latLng);
  return (
    <div className="form__container" onSubmit={(e) => handleReport(e)}>
      <section className="form__inner">
        <h2>Report an animal sighting</h2>
        <form className="">
          <p>
            <label htmlFor="species" className="form__label">
              Species
            </label>
            <select
              name="pets"
              id="pet-select"
              onChange={(e) => setSpecies(e.target.value)}
              value={species}
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

          {/* <Autocomplete
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A}
            placeholder={`${
              capitalizeFirstLetter(species) || 'Animal'
            } sighting location`}
            onPlaceSelected={(selected) => {
              handlePlaceSelected(selected);
            }}
            options={{
              location: { lat: 41.2728571, lng: -73.7772261 },
              radius: 2000,
              types: ['address'],
            }}
            value={autocompleteInput}
            onChange={(e) => setAutocompleteInput(e.target.value)}
          /> */}
          <input
            type="file"
            name="image"
            onChange={(e) => handleInputchange(e)}
            value={fileInput}
            accept="image/png, image/jpeg"
          />

          <GooglePlacesAutocomplete
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A}
            selectProps={{
              value: autocompleteInput,
              onChange: (e) => {
                // only occurs on select
                handlePlaceSelected(e);
                setAutocompleteInput(e);
              },
              placeholder: 'Select animal sighting location',
            }}
            autocompletionRequest={{
              location: latLng || null,
              radius: 20000,
              types: ['address'],
            }}
          />
          {previewSource && (
            <img
              src={previewSource}
              alt="found animal"
              style={{ height: '300px' }}
            />
          )}
          <button type="submit">Report</button>
        </form>
      </section>
    </div>
  );
}

AddMarker.propTypes = {
  addMarker: PropTypes.func,
  latLng: PropTypes.object,
};
