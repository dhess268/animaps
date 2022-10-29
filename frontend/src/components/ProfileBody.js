import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProfileBody({ user }) {
  return (
    <section className="profile__section">
      <section className="profile__inner">
        <h1>My Personal Info</h1>

        <span>
          <strong>Name: </strong>
          {user.firstname} {user.lastname}
        </span>
        <br />
        <span>
          <strong>Address: </strong>
          {user.addressString}
        </span>
        <br />
        <span>
          <strong>Email: </strong>
          {user.email}
        </span>

        <section />
      </section>
    </section>
  );
}
ProfileBody.propTypes = {
  user: PropTypes.object,
};

// username
// NO password lol
// addressString
//  firstname
//  lastname
//  email
//
//
//
//
//
