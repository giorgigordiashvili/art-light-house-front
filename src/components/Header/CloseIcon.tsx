import React from "react";
import Image from "next/image";

type Props = {};

const CloseIcon = (props: Props) => {
  return <Image src={"/assets/closeButton.svg"} width={24} height={24} alt="Close Icon" />;
};

export default CloseIcon;
