import React from "react";

const CopyIcon = ({ size = 24, color = "#d66b29" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 2H3C2.447 2 2 2.447 2 3V9H4V4H9V2ZM21 9H15C14.447 9 14 9.447 14 10V21C14 21.553 14.447 22 15 22H21C21.553 22 22 21.553 22 21V10C22 9.447 21.553 9 21 9ZM20 20H16V11H20V20ZM13 5H7C6.447 5 6 5.447 6 6V19C6 19.553 6.447 20 7 20H13C13.553 20 14 19.553 14 19V6C14 5.447 13.553 5 13 5ZM12 18H8V7H12V18Z"
      fill={color}
    />
  </svg>
);

export default CopyIcon;
