import React from "react";
import Image from "next/image";

type Props = {};

const GoogleMapLogo = (props: Props) => {
  return <Image src={"/assets/googleMaps.svg"} width={26} height={26} alt="google-map-logo" />;
};

export default GoogleMapLogo;
