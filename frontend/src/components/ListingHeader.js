import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ListingHeader({ username }) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    navigate('/');
  }

  function handleProfileClick() {
    navigate('/profile');
  }

  function handleMapNavigate() {
    navigate('/map');
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
          onClick={() => handleMapNavigate()}
        >
          Map
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => navigate('/listings')}
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

ListingHeader.propTypes = {
  username: PropTypes.string,
};
