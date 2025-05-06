import React from 'react';

const SimpleLoader = () => {
  return (
    <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-row gap-2">
      <div className="w-10 bg-[#d991c2] animate-pulse h-10 rounded-full animate-bounce" />
      <div className="w-10 animate-pulse h-10 bg-[#9869b8] rounded-full animate-bounce" />
      <div className="w-10 h-10 animate-pulse bg-[#6756cc] rounded-full animate-bounce" />
         </div>
    </div>
  );
}

export default SimpleLoader; 