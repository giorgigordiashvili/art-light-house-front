"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/utils/getLocaleFromPath";

type Props = {
  size?: "small" | "large";
  href: string;
};

const Logo = ({ size, href }: Props) => {
  const pathname = usePathname();
  // A bare "/" would go through the middleware locale redirect; resolve it to the current locale
  const resolvedHref = href === "/" ? `/${getLocaleFromPath(pathname)}` : href;
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
    <Link href={resolvedHref} prefetch={true}>
      <Image
        src="/assets/Logo.svg"
        alt="logo"
        width={width}
        height={height}
        style={{ cursor: "pointer" }}
      />
    </Link>
  );
};

export default Logo;
