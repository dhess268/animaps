import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { ThreeCircles } from 'react-loader-spinner';
import Map from './components/Map';
import Header from './components/Header';

const libraries = ['places'];
// Create a client (outside of App so it's completely stable and safe from rerenders)
const queryClient = new QueryClient();

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY_A,
    libraries,
  });

  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('https://animaps-production.up.railway.app/auth/current_user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // console.log('fetchuseraction', response.data);
          localStorage.setItem('token', response.data.token);
          setUserData(response.data);
        })
        .catch((error) => {
          localStorage.clear();
          navigate('/login');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!isLoaded)
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

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Map userAddress={userData.addressLatLng} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
