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

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchedAddress }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        map.panTo({ lat, lng });
      } else {
      }
    });
  }, [searchedAddress, map]);

  return null;
}
