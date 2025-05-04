import * as React from "react";

const DecreaseIcon = ({
  color = "#FFCB40",
  opacity = 0.5,
}: {
  color?: string;
  opacity?: number;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none">
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.725}
      d="M3.75 9h10.5"
      opacity={opacity}
    />
  </svg>
);

export default DecreaseIcon;
