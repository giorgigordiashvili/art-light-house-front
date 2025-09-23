"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

type Props = {
  searchedAddress?: string;
};

export default function MapController({ searchedAddress }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!searchedAddress || !map || !window.google) return;

    console.log("🔍 Searching for address:", searchedAddress);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchedAddress }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        console.log("🎯 Address found - Coordinates:", {
          searchedAddress: searchedAddress,
          latitude: lat,
          longitude: lng,
          coordinates: `${lat}, ${lng}`,
          fullAddress: results[0].formatted_address,
        });

        map.panTo({ lat, lng });
      } else {
        console.warn("Forward geocoding failed:", status);
      }
    });
  }, [searchedAddress, map]);

  return null;
}
