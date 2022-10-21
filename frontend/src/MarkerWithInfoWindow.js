import { useState } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';
import moment from 'moment';

export default function MarkerWithInfoWindow(props) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggleOpen() {
    setIsOpen((current) => !current);
  }
  console.log(props);
  function renderMarker() {
    return (
      <MarkerF position={props.position} onClick={() => onToggleOpen()}>
        {isOpen && (
          <InfoWindowF onCloseClick={() => onToggleOpen()}>
            <h3>{props.time}</h3>
          </InfoWindowF>
        )}
      </MarkerF>
    );
  }

  return renderMarker();
}
