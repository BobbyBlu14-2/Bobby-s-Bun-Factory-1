
import React from 'react';

const GearLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <img 
        src="https://i.imgur.com/mzgn7XS.png" 
        alt="Bobby's Bun Factory Logo" 
        className="w-full h-full object-contain animate-spin-slow"
        style={{ animationDuration: '40s' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default GearLogo;
