import React from 'react';

interface VideoIconProps {
  className?: string;
}

const VideoIcon: React.FC<VideoIconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg 
      viewBox="0 0 24 18" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Camera lenses - two small circles at top */}
      <circle cx="5" cy="3" r="1.5" />
      <circle cx="10" cy="3" r="1.5" />
      
      {/* Main camera body - large rounded rectangle */}
      <rect 
        x="1" 
        y="6" 
        width="14" 
        height="11" 
        rx="2" 
        ry="2"
      />
      
      {/* Camera viewfinder/extension - triangle */}
      <polygon points="15,9 15,14 21,11.5" />
    </svg>
  );
};

export default VideoIcon;
