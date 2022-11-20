import { useNavigate } from 'react-router-dom';

const logo = require('../pics/ANIMAPS.png');

export default function HeaderTest(props) {
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top navbar-extend-md top__margin">
      <div className="container-fluid">
        <a className="navbar-brand" href="/map">
          <img src={logo} alt="logo" width={40} />
        </a>

        <button
          className="btn btn-outline-success"
          type="button"
          onClick={() => handleMapNavigate()}
        >
          Map
        </button>
        <button
          className="btn btn-outline-success"
          type="button"
          onClick={() => navigate('/sightings')}
        >
          Animal Sightings
        </button>
        <button
          className="btn btn-outline-success"
          type="button"
          onClick={() => navigate('/profile')}
        >
          {/* {props.username}'s Profile */}Profile
        </button>
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
