import { MarkerF } from '@react-google-maps/api';

export default function MarkerWithInfoWindow(props) {
  function onToggleOpen() {
    props.onMarkerClick(props.id);
  }

  function renderMarker() {
    return <MarkerF position={props.position} onClick={() => onToggleOpen()} />;
  }

  return renderMarker();
}
