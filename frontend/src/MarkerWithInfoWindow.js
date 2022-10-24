import { useState } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';

export default function MarkerWithInfoWindow(props) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggleOpen() {
    props.onMarkerClick(props.position.lat, props.position.lng);
    setIsOpen((current) => !current);
  }

  function renderMarker() {
    return (
      <MarkerF position={props.position} onClick={() => onToggleOpen()}>
        {isOpen && (
          <InfoWindowF onCloseClick={() => onToggleOpen()}>
            <div>
              <h3>{props.time || 'Error: Time not noted'}</h3>
              <span>
                Species: {props.species || 'Error: Species not noted'}
              </span>
              <p>{props.description || 'Description of sighting not found'}</p>
            </div>
          </InfoWindowF>
        )}
      </MarkerF>
    );
  }

  return renderMarker();
}
