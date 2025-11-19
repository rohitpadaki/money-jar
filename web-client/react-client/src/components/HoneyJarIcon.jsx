import React from 'react';

const HoneyJarIcon = ({ size = 40, className = '' }) => {
  return (
    <div className={`inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Jar body */}
        <path
          d="M10 15C10 13.8954 10.8954 13 12 13H28C29.1046 13 30 13.8954 30 15V32C30 34.2091 28.2091 36 26 36H14C11.7909 36 10 34.2091 10 32V15Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1"
        />
        
        {/* Jar lid */}
        <rect
          x="8"
          y="9"
          width="24"
          height="6"
          rx="2"
          fill="#B45309"
          stroke="#92400E"
          strokeWidth="1"
        />
        
        {/* Jar handle */}
        <path
          d="M32 18C33.1046 18 34 18.8954 34 20V24C34 25.1046 33.1046 26 32 26"
          stroke="#D97706"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Honey inside */}
        <path
          d="M12 17H28V30C28 31.1046 27.1046 32 26 32H14C12.8954 32 12 31.1046 12 30V17Z"
          fill="#FBBF24"
          opacity="0.8"
        />
        
        {/* Lid knob */}
        <circle cx="20" cy="12" r="2" fill="#78350F" />
        
        {/* Honey drip */}
        <path
          d="M20 15C20 15 21 16 21 17C21 17.5523 20.5523 18 20 18C19.4477 18 19 17.5523 19 17C19 16 20 15 20 15Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};

export default HoneyJarIcon;