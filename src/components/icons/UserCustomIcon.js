import React from 'react';

const UserCustomIcon = ({ size = 24, color = '#d66b29' }) => (
  <svg
    width={size}
    height={(size / 50) * 54} // Adjust height to maintain aspect ratio
    viewBox="0 0 50 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1875 38.3137C13.9584 36.8573 15.9375 35.709 18.125 34.8688C20.3125 34.0286 22.6042 33.6085 25 33.6085C27.3959 33.6085 29.6875 34.0286 31.875 34.8688C34.0625 35.709 36.0417 36.8573 37.8125 38.3137C39.0278 36.7826 39.974 35.0462 40.6511 33.1044C41.3281 31.1625 41.6667 29.09 41.6667 26.8868C41.6667 21.9202 40.0434 17.6911 36.7969 14.1996C33.5504 10.708 29.6181 8.96227 25 8.96227C20.382 8.96227 16.4497 10.708 13.2031 14.1996C9.95662 17.6911 8.33335 21.9202 8.33335 26.8868C8.33335 29.09 8.6719 31.1625 9.34898 33.1044C10.0261 35.0462 10.9722 36.7826 12.1875 38.3137ZM25 29.1274C22.9514 29.1274 21.224 28.3712 19.8177 26.8588C18.4115 25.3464 17.7084 23.4886 17.7084 21.2854C17.7084 19.0822 18.4115 17.2244 19.8177 15.712C21.224 14.1996 22.9514 13.4434 25 13.4434C27.0486 13.4434 28.7761 14.1996 30.1823 15.712C31.5886 17.2244 32.2917 19.0822 32.2917 21.2854C32.2917 23.4886 31.5886 25.3464 30.1823 26.8588C28.7761 28.3712 27.0486 29.1274 25 29.1274ZM25 49.2925C22.1181 49.2925 19.4097 48.7043 16.875 47.528C14.3403 46.3517 12.1354 44.7553 10.2604 42.7388C8.38544 40.7223 6.90106 38.351 5.80731 35.625C4.71356 32.899 4.16669 29.9862 4.16669 26.8868C4.16669 23.7873 4.71356 20.8746 5.80731 18.1486C6.90106 15.4226 8.38544 13.0513 10.2604 11.0348C12.1354 9.01829 14.3403 7.42188 16.875 6.24559C19.4097 5.06929 22.1181 4.48114 25 4.48114C27.882 4.48114 30.5903 5.06929 33.125 6.24559C35.6597 7.42188 37.8646 9.01829 39.7396 11.0348C41.6146 13.0513 43.099 15.4226 44.1927 18.1486C45.2865 20.8746 45.8334 23.7873 45.8334 26.8868C45.8334 29.9862 45.2865 32.899 44.1927 35.625C43.099 38.351 41.6146 40.7223 39.7396 42.7388C37.8646 44.7553 35.6597 46.3517 33.125 47.528C30.5903 48.7043 27.882 49.2925 25 49.2925Z"
      fill={color}
    />
  </svg>
);

export default UserCustomIcon;
