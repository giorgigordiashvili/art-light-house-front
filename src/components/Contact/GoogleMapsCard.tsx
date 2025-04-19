"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";

export default function Intro() {
  const position = { lat: 41.720542, lng: 44.764789 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <div style={{ width: "612px", height: "241px", borderRadius: "24px" }}>
        <Map zoom={17} center={position} mapId={process.env.NEXT_PUBLIC_MAP_ID}>
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin background={"yellow"} borderColor={"none"} glyphColor={"white"} />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>I'm in Telos</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
