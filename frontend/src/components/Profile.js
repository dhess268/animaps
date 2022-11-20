import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ThreeCircles } from 'react-loader-spinner';
import ProfileBody from './ProfileBody';

export default function Profile() {
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
          console.log('fetchuseraction', response.data);
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

  return userData ? (
    <>
      <button type="button" className="btn btn-primary">
        Edit
      </button>
      <ProfileBody user={userData} />
    </>
  ) : (
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
