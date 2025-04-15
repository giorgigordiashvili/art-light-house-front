import React from "react";
import Image from "next/image";

type Props = {
  size?: "small" | "large";
};

const Logo = ({ size }: Props) => {
  let width = 111;
  let height = 41;

  switch (size) {
    case "large":
      width = 181;
      height = 74;
      break;
    case "small":
    default:
      width = 111;
      height = 41;
      break;
  }

  return (
    <Image
      src="/assets/Logo.png"
      alt="logo"
      width={width}
      height={height}
      style={{ cursor: "pointer" }}
    />
  );
};

export default Logo;
