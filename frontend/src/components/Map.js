import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import { GoogleMap, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';
import haversine from 'haversine-distance';
import { ThreeCircles } from 'react-loader-spinner';
import Modal from 'react-modal';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import AddMarker from './AddMarker';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

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
      closeModal();
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
    setIsOpen(false);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  if (isLoading) {
    return (
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

  if (isError) {
    return <div>An error has occured. Please reload the page</div>;
  }

  return (
    <div className="map-container">
      <button
        type="button"
        className="btn btn-success btn__modal"
        onClick={() => openModal()}
        hidden={modalIsOpen}
      >
        Report Animal Sighting
      </button>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
        appElement={document.getElementById('root')}
      >
        <button onClick={() => closeModal()} type="button">
          close
        </button>
        <AddMarker addMarker={mutate} latLng={center3} />
      </Modal>
      {center3 && (
        <div className="map">
          <GoogleMap
            zoom={16}
            center={center3}
            mapContainerStyle={{
              height: '100%',
              width: '100%',
              minHeight: '92vh',
              marginTop: '70px',
            }}
            className="map__main"
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
                  width: `25vw`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `20px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: '300px',
                  marginTop: '4px',
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
                style={{ 'max-width': '1000px' }}
              >
                <div className="infowindow">
                  <img
                    src={openMarker.image.url}
                    alt={`Spotted ${openMarker.species}`}
                    className="card-img-top"
                    width="250px"
                    height="250px"
                  />
                  <div className="">
                    <h5 className="card-title">
                      {openMarker.species[0].toUpperCase() +
                        openMarker.species.substring(1)}{' '}
                      sighting
                    </h5>
                    <p className="card-text">{openMarker.description}</p>
                    <span>
                      Sighting reported at:{' '}
                      {openMarker.time || 'Error: Time not noted'}
                    </span>
                    <br />
                    <br />
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-danger w-100"
                    >
                      Close
                    </button>
                  </div>
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
