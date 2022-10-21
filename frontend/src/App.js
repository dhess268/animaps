import { useCallback, useMemo, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import moment from 'moment';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import AddMarker from './containers/AddMarker';

const markerData = [
  {
    pos: { lat: 44, lng: -80 },
    description: 'This is a marker where an animal could have been spotted',
    species: 'cat',
    time: 'Jan 1st 1998',
  },
  {
    pos: {
      lat: 41.2709,
      lng: -73.7776,
    },
    description: 'This is a marker where an animal could have been spotted',
    species: 'dog',
    time: 'Jan 1st 1998',
  },
];
const libraries = ['places'];
function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A,
    libraries,
  });
  if (!isLoaded) return <div className="App">Loading...</div>;
  return <Map />;
}

function Map() {
  const [markers, setMarkers] = useState(markerData);
  const center2 = useMemo(() => ({ lat: 41.2709, lng: -73.7776 }), []);
  const [center3, setCenter3] = useState(center2);
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [map, setMap] = useState(null);
  function onLoad(auto) {
    setAutocomplete(auto);
  }
  async function onPlaceChanged() {
    if (autocomplete !== null) {
      // console.log(autocomplete.getPlace().geometry.location.lat());
      // console.log(autocomplete.getPlace().geometry.location.lng());
      setCenter3({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });

      setInputValue('');
      // console.log(map);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  function handleCenterChange() {
    if (map) {
      map.setZoom(16);
    }
  }

  const addMarker = useCallback(
    (newMarker) => {
      const newMarkerData = {
        pos: { lat: newMarker.lat, lng: newMarker.lng },
        description: newMarker.description,
        species: newMarker.species,
        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
      };
      setMarkers((currMarkers) => [...currMarkers, newMarkerData]);
    },
    [setMarkers]
  );

  return (
    <div className="map-container">
      <AddMarker addMarker={addMarker} />
      <GoogleMap
        zoom={16}
        center={center3}
        mapContainerStyle={{
          height: '50vh',
          width: '50vw',
        }}
        clickableIcons={false}
        // onClick={(e) => console.log(e.latLng.lat())}
        onCenterChanged={() => handleCenterChange()}
        onLoad={(thisMap) => setMap(thisMap)}
        // ref={(maap) => setMap(maap)}
      >
        <Autocomplete
          onLoad={(auto) => onLoad(auto)}
          onPlaceChanged={() => onPlaceChanged()}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
            }}
            onChange={(e) => setInputValue(e.value)}
            value={inputValue}
          />
        </Autocomplete>
        {markers.map((marker, i) => (
          <MarkerWithInfoWindow
            position={marker.pos}
            time={marker.time}
            species={marker.species}
            description={marker.description}
            key={i}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default App;
