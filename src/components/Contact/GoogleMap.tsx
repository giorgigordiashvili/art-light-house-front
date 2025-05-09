// "use client";

// import { useState } from "react";
// import styled from "styled-components";
// import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
// import CustomPin from "./CustomPIn";

// const StyledMap = styled.div`
//   width: 610px;
//   height: 241px;
//   border-radius: 24px;
//   overflow: hidden;
//   @media (max-width: 1346px) {
//     width: 100%;
//   }
//   @media (max-width: 1080px) {
//     border-radius: 12px;
//   }
// `;

// export default function GoogleMap() {
//   const position = { lat: 41.720542, lng: 44.764789 };
//   const [open, setOpen] = useState(false);

//   return (
//     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
//       <StyledMap>
//         <Map
//           defaultZoom={17}
//           defaultCenter={position}
//           mapId={process.env.NEXT_PUBLIC_MAP_ID}
//           gestureHandling="auto"
//           disableDefaultUI={true}
//           zoomControl={true}
//           scrollwheel={true}
//           draggable={true}
//           colorScheme="DARK"
//         >
//           <AdvancedMarker position={position} onClick={() => setOpen(true)}>
//             <CustomPin />
//           </AdvancedMarker>

//           {open && (
//             <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
//               <p>ბახტრიონის N23</p>
//             </InfoWindow>
//           )}
//           <Markers />
//         </Map>
//       </StyledMap>
//     </APIProvider>
//   );
// }

// const Markers = () => {
//   return null;
// };

"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import CustomPin from "./CustomPIn";

const StyledMap = styled.div<{ $variant: 1 | 2 }>`
  ${({ $variant }) =>
    $variant === 1
      ? css`
          width: 610px;
          height: 241px;
        `
      : css`
          width: 460px;
          height: 181px;
        `}
  border-radius: 24px;
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
};

export default function GoogleMap({ variant = 1 }: Props) {
  const position = { lat: 41.720542, lng: 44.764789 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <StyledMap $variant={variant}>
        <Map
          defaultZoom={17}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          gestureHandling="auto"
          disableDefaultUI={true}
          zoomControl={true}
          scrollwheel={true}
          draggable={true}
          colorScheme="DARK"
        >
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <CustomPin />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>ბახტრიონის N23</p>
            </InfoWindow>
          )}
          <Markers />
        </Map>
      </StyledMap>
    </APIProvider>
  );
}

const Markers = () => null;
