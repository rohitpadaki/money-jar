import React from 'react';

const HexagonIcon = ({ size = 60, className = '', color = '#F59E0B' }) => {
  return (
    <div className={`inline-flex ${className}`}>
      <svg width={size} height={size * 0.866} viewBox="0 0 60 52" fill="none">
        <path
          d="M45 1.5L54.5263 10.75V29.25L45 38.5H15L5.47372 29.25V10.75L15 1.5H45Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
        <path
          d="M45 3L53.0622 11.5V28.5L45 37H15L6.93782 28.5V11.5L15 3H45Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default HexagonIcon;