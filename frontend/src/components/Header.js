import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Header({ username }) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    navigate('/');
  }

  function handleProfileClick() {
    navigate('/profile');
  }

  function handleListClick() {
    navigate('/listings');
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Animaps
        </a>
        <button
          className="btn btn-outline-success"
          type="button"
          onClick={() => navigate('/map')}
        >
          Map
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => handleListClick()}
        >
          Animal Listings
        </button>
        {username && (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => handleProfileClick()}
          >
            {username}'s Profile
          </button>
        )}
        <button
          className="btn btn-outline-success"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

Header.propTypes = {
  username: PropTypes.string,
};
