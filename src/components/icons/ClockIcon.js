// src/components/icons/ClockIcon.js

import React from "react";

const ClockIcon = ({ size = 24, color = "#d66b29" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12H6" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ClockIcon;
