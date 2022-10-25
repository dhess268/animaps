import { useMemo, useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import { GoogleMap, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import AddMarker from './AddMarker';

function Map() {
  const center2 = useMemo(() => ({ lat: 41.2709, lng: -73.7776 }), []);
  const [center3, setCenter3] = useState(center2);
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [map, setMap] = useState(null);
  const [openMarker, setOpenMarker] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // useEffect(() => {
  //   getMarkers();
  // }, [setMarkers]);

  const { data, isLoading, isError, refetch } = useQuery(
    ['markerQuery'],
    async () => {
      const markerData = await getMarkers();
      return markerData;
    }
  );

  // this will mutate the SERVER side data and then on success we can do stuff
  const { mutate } = useMutation(
    async (newMarker) => {
      await postMarker(newMarker);
    },
    {
      onSuccess: () => refetch(),
    }
  );

  function onLoad(auto) {
    setAutocomplete(auto);
  }

  function getMarkers() {
    return axios
      .get('http://localhost:8000/markers')
      .then((serverData) => serverData.data);
  }

  function postMarker(marker) {
    return axios.post('http://localhost:8000/markers', marker);
  }

  async function onPlaceChanged() {
    if (autocomplete !== null) {
      setCenter3({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });

      setInputValue('');
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  function handleCenterChange() {
    if (map) {
      map.setZoom(16);
    }
  }

  function handleCenterAndZoom(lat, lng) {
    if (map) {
      map.setZoom(16);
      setCenter3({
        lat,
        lng,
      });
    }
  }

  function openMarkerInfoWindow(markerId) {
    const marker = data.find((cachedMarker) => cachedMarker._id === markerId);
    handleCenterAndZoom(marker.lat, marker.lng);
    setIsOpen(true);
    setOpenMarker(marker);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>An error has occured. Please reload the page</div>;
  }

  return (
    <div className="map-container">
      <AddMarker addMarker={mutate} />
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
        options={{ gestureHandling: 'greedy' }}
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
        {data.map((marker, i) => (
          <MarkerWithInfoWindow
            position={{ lat: marker.lat, lng: marker.lng }}
            time={marker.time}
            species={marker.species}
            description={marker.description}
            onMarkerClick={(id) => openMarkerInfoWindow(id)}
            key={marker._id}
            id={marker._id}
          />
        ))}

        {isOpen && (
          <InfoWindowF
            onCloseClick={() => setIsOpen(false)}
            key={openMarker._id}
            position={{ lat: openMarker.lat, lng: openMarker.lng }}
          >
            <div>
              <h3>{openMarker.time || 'Error: Time not noted'}</h3>
              <span>
                Species: {openMarker.species || 'Error: Species not noted'}
              </span>
              <p>
                {openMarker.description || 'Description of sighting not found'}
              </p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}

export default Map;
