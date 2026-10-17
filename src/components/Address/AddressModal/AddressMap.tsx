"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { APIProvider, Map, MapMouseEvent, useMap } from "@vis.gl/react-google-maps";

type Coords = { lat: number; lng: number };

// Same look as GoogleMap variant 2, plus forward-geocode results reported back to the caller.
const StyledMap = styled.div`
  height: 181px;
  border-radius: 12px;
  overflow: hidden;
`;

const DEFAULT_POSITION: Coords = { lat: 41.703998, lng: 44.791769 };

type ControllerProps = {
  searchedAddress?: string;
  onGeocoded?: (coords: Coords, address: string) => void;
};

function AddressMapController({ searchedAddress, onGeocoded }: ControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!searchedAddress || !map || !window.google) return;

    let cancelled = false;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchedAddress }, (results, status) => {
      if (cancelled) return;
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const coords = { lat: location.lat(), lng: location.lng() };
        map.panTo(coords);
        onGeocoded?.(coords, searchedAddress);
      }
    });

    return () => {
      cancelled = true;
    };
    // onGeocoded is intentionally excluded so a new callback identity does not re-geocode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedAddress, map]);

  return null;
}

type Props = {
  searchedAddress?: string;
  location?: Coords | null;
  onLocationSelect?: (address: string, coordinates?: Coords) => void;
  onGeocoded?: (coords: Coords, address: string) => void;
};

export default function AddressMap({
  searchedAddress,
  location,
  onLocationSelect,
  onGeocoded,
}: Props) {
  const centerPosition =
    location && isFinite(location.lat) && isFinite(location.lng) ? location : DEFAULT_POSITION;

  const handleMapClick = (event: MapMouseEvent) => {
    const lat = event.detail?.latLng?.lat;
    const lng = event.detail?.latLng?.lng;

    if (!lat || !lng || !onLocationSelect) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        onLocationSelect(results[0].formatted_address, { lat, lng });
      }
    });
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <StyledMap>
        <Map
          defaultZoom={17}
          defaultCenter={centerPosition}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          gestureHandling="auto"
          disableDefaultUI={true}
          zoomControl={true}
          scrollwheel={true}
          draggable={true}
          colorScheme="DARK"
          onClick={handleMapClick}
        >
          <AddressMapController searchedAddress={searchedAddress} onGeocoded={onGeocoded} />
        </Map>
      </StyledMap>
    </APIProvider>
  );
}
