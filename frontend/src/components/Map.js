import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import { GoogleMap, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';
import haversine from 'haversine-distance';
import { ThreeCircles } from 'react-loader-spinner';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import AddMarker from './AddMarker';

function Map({ userAddress }) {
  const [center3, setCenter3] = useState(userAddress);
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [map, setMap] = useState(null);
  const [openMarker, setOpenMarker] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery(['markerQuery'], () =>
    getMarkers()
  );

  // this will mutate the SERVER side data and then on success we can do stuff
  const { mutate } = useMutation(
    async (newMarker) => {
      await postMarker(newMarker);
    },
    {
      // onSuccess: () => queryClient.invalidateQueries('markerQuery'),
      onSettled: () => {
        queryClient.invalidateQueries('markerQuery');
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData('markerQuery', context.previousMarkers);
      },
      onMutate: async (newMarker) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('markerQuery');

        // Snapshot the previous value
        const previousMarkers = queryClient.getQueryData('markerQuery');

        // Optimistically update to the new value
        queryClient.setQueryData('markerQuery', (old) => [...old, newMarker]);

        // Return a context object with the snapshotted value
        return { previousMarkers };
      },
    }
  );
  useEffect(() => {
    setCenter3(userAddress);
  }, [userAddress]);

  function onLoad(auto) {
    setAutocomplete(auto);
  }

  async function getMarkers() {
    const res = await axios
      .get('https://animaps-production.up.railway.app/markers')
      .then((serverData) => serverData.data);
    return res;
  }

  function postMarker(marker) {
    return axios.post(
      'https://animaps-production.up.railway.app/markers',
      marker
    );
  }

  async function onPlaceChanged() {
    if (autocomplete !== null) {
      setCenter3({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });

      setInputValue('');
    } else {
      // console.log('Autocomplete is not loaded yet!');
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
    return (
      <ThreeCircles
        height="100"
        width="100"
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass="flex-d justify-content-center align-items-center h-100"
        visible
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />
    );
  }

  if (isError) {
    return <div>An error has occured. Please reload the page</div>;
  }

  return (
    <div className="map-container">
      <AddMarker addMarker={mutate} latLng={center3} />
      {center3 && (
        <div className="map">
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
            options={{
              gestureHandling: 'greedy',
            }}
          >
            <Autocomplete
              onLoad={(auto) => onLoad(auto)}
              onPlaceChanged={() => onPlaceChanged()}
              location={center3}
              options={{
                location: center3 || null,
                radius: 20000,
                types: ['address'],
              }}
              bounds={{
                east: center3.lng - 0.1,
                west: center3.lng + 0.1,
                north: center3.lat + 0.1,
                south: center3.lat - 0.1,
              }}
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
                image={marker.image}
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
                    {openMarker.description ||
                      'Description of sighting not found'}
                  </p>
                  <img
                    src={openMarker.image.url}
                    alt={`Spotted ${openMarker.species}`}
                  />
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
}

export default Map;

Map.propTypes = {
  userAddress: PropTypes.object,
};
