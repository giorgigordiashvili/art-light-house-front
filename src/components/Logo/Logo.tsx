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

  const handleClick = (e: React.MouseEvent) => {
    // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(href, "_blank");
      return;
    }
    router.push(href);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click)
    if (e.button === 1) {
      e.preventDefault(); // Prevent default middle-click behavior
      window.open(href, "_blank");
    }
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
      height = 45;
      break;
  }

  return (
    <Image
      src="/assets/Logo.svg"
      alt="logo"
      width={width}
      height={height}
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    />
  );
};

export default Logo;
