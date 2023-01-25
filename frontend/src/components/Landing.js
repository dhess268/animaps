import '../css/landing.css';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  function handleMapNavigation() {
    navigate('/map');
  }
  return (
    <section className="hero">
      <section className="hero__inner">
        <h1 className="hero__heading">
          We're on a mission to get animals off the street
        </h1>
        <span className="hero__span">
          This means longer, happier lives for human and animal alike!
        </span>
        <div className="btn__container">
          <button
            type="button"
            className="btn btn-primary hero__btn"
            onClick={handleMapNavigation}
          >
            View Our Animal Map
          </button>
        </div>
      </section>
    </section>
  );
}
