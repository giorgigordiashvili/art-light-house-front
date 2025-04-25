"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  size?: "small" | "large";
  href: string;
};

const Logo = ({ size, href }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

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
      onClick={handleClick}
    />
  );
};

export default Logo;
