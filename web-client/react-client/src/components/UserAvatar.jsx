import React from 'react';

const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`${sizes[size]} bg-honey-500 rounded-full flex items-center justify-center text-white font-medium ${className}`}>
      {user.name[0].toUpperCase()}
    </div>
  );
};

export default UserAvatar;