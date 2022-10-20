import { useState } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';

export default function MarkerWithInfoWindow(props) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggleOpen() {
    setIsOpen((current) => !current);
  }

  function renderMarker() {
    return (
      <MarkerF position={props.position} onClick={() => onToggleOpen()}>
        {isOpen && (
          <InfoWindowF onCloseClick={() => onToggleOpen()}>
            <h3>{props.content}</h3>
          </InfoWindowF>
        )}
      </MarkerF>
    );
  }

  return renderMarker();
}
