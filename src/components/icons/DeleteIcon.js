import React from 'react';

const DeleteIcon = ({ size = 24, color = "#D62828" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 6h18M8 6v12m4-12v12m4-12v12M5 6v12a2 2 0 002 2h10a2 2 0 002-2V6M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default DeleteIcon;
