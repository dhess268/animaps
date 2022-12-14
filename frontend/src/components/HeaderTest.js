import { useNavigate } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import { useState } from 'react';

const logo = require('../pics/ANIMAPS.png');

export default function HeaderTest() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    navigate('/');
    setOpen(false);
  }

  // function handleProfileClick() {
  //   setOpen(false);
  //   navigate('/profile');
  // }

  function handleMapNavigate() {
    setOpen(false);

    navigate('/map');
  }

  function handleSightingsNavigate() {
    setOpen(false);

    navigate('/sightings');
  }

  function handleProfileNavigate() {
    setOpen(false);
    navigate('/profile');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top  top__margin">
      <div className="container-fluid">
        <button
          className="btn"
          type="button"
          onClick={() => handleMapNavigate()}
        >
          <img src={logo} alt="logo" width={40} />
        </button>

        <button
          className="btn btn-outline-success topnav"
          type="button"
          onClick={() => handleMapNavigate()}
        >
          Map
        </button>
        <button
          className="btn btn-outline-success topnav"
          type="button"
          onClick={() => handleSightingsNavigate()}
        >
          Animal Sightings
        </button>
        <button
          className="btn btn-outline-success topnav"
          type="button"
          onClick={() => handleProfileNavigate()}
        >
          {/* {props.username}'s Profile */}Profile
        </button>
        <button
          className="btn btn-outline-success topnav"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
        <div className="hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen} label="Show menu" />
        </div>
      </div>
      {isOpen ? (
        <>
          <button
            className="header__responsive"
            type="button"
            onClick={() => handleMapNavigate()}
          >
            Map
          </button>
          <button
            className="header__responsive"
            type="button"
            onClick={() => handleSightingsNavigate()}
          >
            Animal Sightings
          </button>
          <button
            className="header__responsive"
            type="button"
            onClick={() => handleProfileNavigate()}
          >
            {/* {props.username}'s Profile */}Profile
          </button>
          <button
            className=" header__responsive"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : null}
    </nav>
  );
}
