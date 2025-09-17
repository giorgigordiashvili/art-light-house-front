"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import CustomPin from "./CustomPIn";
import MapController from "./MapController";

const StyledMap = styled.div<{ $variant: 1 | 2 }>`
  ${({ $variant }) =>
    $variant === 1
      ? css`
          width: 610px;
          height: 241px;
          border-radius: 24px;
        `
      : css`
          width: 460px;
          height: 181px;
          border-radius: 12px;
        `}
  overflow: hidden;

  @media (max-width: 1346px) {
    width: 100%;
  }

  @media (max-width: 1080px) {
    border-radius: 12px;
  }
`;

type Props = {
  variant?: 1 | 2;
  dictionary?: any;
  onLocationSelect?: (address: string, coordinates?: { lat: number; lng: number }) => void;
  searchedAddress?: string;
};

export default function GoogleMap({
  variant = 1,
  dictionary,
  onLocationSelect,
  searchedAddress,
}: Props) {
  const defaultPosition = { lat: 41.720542, lng: 44.764789 };
  const [open, setOpen] = useState(false);

  const handleMapClick = (event: MapMouseEvent) => {
    const lat = event.detail?.latLng?.lat;
    const lng = event.detail?.latLng?.lng;

    // Console log the coordinates when user clicks on map
    if (lat && lng) {
      console.log("📍 Map clicked - Coordinates:", {
        latitude: lat,
        longitude: lng,
        coordinates: `${lat}, ${lng}`,
      });
    }

    if (!lat || !lng || !onLocationSelect) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        console.log("🏠 Address found for coordinates:", {
          latitude: lat,
          longitude: lng,
          address: results[0].formatted_address,
        });
        // Pass both address and coordinates to the callback
        onLocationSelect(results[0].formatted_address, { lat, lng });
      } else {
        console.warn("Reverse geocoding failed:", status);
      }
    });
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <StyledMap $variant={variant}>
        <Map
          defaultZoom={17}
          defaultCenter={defaultPosition}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          gestureHandling="auto"
          disableDefaultUI={true}
          zoomControl={true}
          scrollwheel={true}
          draggable={true}
          colorScheme="DARK"
          onClick={handleMapClick}
        >
          {variant !== 2 && (
            <>
              <AdvancedMarker position={defaultPosition} onClick={() => setOpen(true)}>
                <CustomPin />
              </AdvancedMarker>
              {open && (
                <InfoWindow position={defaultPosition} onCloseClick={() => setOpen(false)}>
                  <p>{dictionary?.googleMapClusterAddress || "ბახტრიონის N23"}</p>
                </InfoWindow>
              )}
            </>
          )}
          <MapController searchedAddress={searchedAddress} />
        </Map>
      </StyledMap>
    </APIProvider>
  );
}
