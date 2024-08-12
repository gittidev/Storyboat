import React from 'react';
import './MainAI.css'

const MainAI: React.FC = () => {
  return (
    <div className='MainAimid'>
      <div>
        <video
          src='/mainai1.mp4'
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
};

export default MainAI;
