import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A,
  });

  if (!isLoaded) return <div className="App">Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 44, lng: -80 }));
  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="map-container"
    />
  );
}

export default App;
