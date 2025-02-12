import React from 'react';

const EyeIcon = ({ size = 24, color = '#d66b29' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C11.0941 9 10.282 9.40154 9.73188 10.0364C9.81721 10.0127 9.90713 10 10 10C10.5523 10 11 10.4477 11 11C11 11.5523 10.5523 12 10 12C9.57566 12 9.21306 11.7357 9.06782 11.3627C9.0234 11.5681 9 11.7813 9 12C9 13.6569 10.3431 15 12 15Z"
            fill={color}
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.67895 10.5893C5.64331 9.13292 8.13685 6 12 6C15.8632 6 18.3567 9.13292 19.3211 10.5893L19.3639 10.6535C19.5748 10.969 19.8565 11.3902 19.8565 12C19.8565 12.6098 19.5748 13.031 19.3639 13.3465L19.3211 13.4107C18.3567 14.8671 15.8632 18 12 18C8.13685 18 5.64331 14.8671 4.67895 13.4107L4.63614 13.3465C4.42519 13.031 4.14355 12.6098 4.14355 12C4.14355 11.3902 4.42519 10.969 4.63614 10.6535L4.67895 10.5893ZM12 8C11.6144 8 11.2442 8.04489 10.8901 8.12594C11.2574 8.04518 11.6288 8 12 8ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM12 16C12.3856 16 12.7558 15.9551 13.11 15.874C12.7426 15.9548 12.3712 16 12 16Z"
            fill={color}
        />
    </svg>
);

export default EyeIcon;
