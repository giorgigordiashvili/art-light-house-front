"use client";
import React from "react";

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

const HeartIcon: React.FC<Props> = ({ width = 20, height = 20, color = "white" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0083 5.00083C5.41667 0.833332 0.833333 6.66667 4.81833 10.8342L10.0092 16.6667L15.2008 10.8333C19.1667 6.66667 14.5833 0.832498 10.0083 5.00083Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HeartIcon;
