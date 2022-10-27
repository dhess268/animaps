import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/auth/current_user', {
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

  return (
    <div>
      <ProfileHeader />
      <ProfileBody user={userData} />
    </div>
  );
}
