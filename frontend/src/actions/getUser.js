import axios from 'axios';

export default async function getUser(token) {
  const user = await axios
    .get('https://animaps-production.up.railway.app/auth/current_user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      return response.data;
    })
    .catch((error) => {
      localStorage.clear();
      window.location.href = '/';
    });
  return user;
}
