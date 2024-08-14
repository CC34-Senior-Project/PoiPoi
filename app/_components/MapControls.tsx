import { useEffect, useRef } from "react";
import { FitBoundsOptions } from "maplibre-gl";
import { NavigationControl, GeolocateControl } from "react-map-gl/maplibre";

interface MapControlProps {
  handleUserCoordinates: (position: GeolocationCoordinates) => void;
  handleSetClosestNotCompletedPin: (position: GeolocationCoordinates) => void;
}

const MapControls = ({
  handleUserCoordinates,
  handleSetClosestNotCompletedPin,
}: MapControlProps): React.JSX.Element => {
  const geolocateFitBoundsOptions: FitBoundsOptions = {
    // duration: 1500,
    // minZoom: 14,
    // maxZoom: 17,
    zoom: 17,
    linear: true,
    // curve: undefined,
  };

  const geolocatePositionOptions: PositionOptions = {
    enableHighAccuracy: true,
  };

  const geolocationRef = useRef<maplibregl.GeolocateControl | null>(null);

  useEffect(() => {
    if (!geolocationRef.current) {
      return;
    }
    geolocationRef.current.trigger();
  }, [geolocationRef.current]);

  const handleGeolocateError = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert(
        "Geolocation permission denied. Please enable geolocation in your browser settings."
      );
    }
  };

  return (
    <div id="mapControl">
      <NavigationControl position="top-right" />
      <GeolocateControl
        position="bottom-right"
        ref={geolocationRef}
        fitBoundsOptions={geolocateFitBoundsOptions}
        trackUserLocation={true}
        onError={handleGeolocateError}
        onGeolocate={(evt) => {
          handleUserCoordinates(evt.coords);
          handleSetClosestNotCompletedPin(evt.coords);
        }}
        positionOptions={geolocatePositionOptions}
      />
    </div>
  );
};

export default MapControls;
