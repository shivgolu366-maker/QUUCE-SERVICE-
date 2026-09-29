import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  title?: string;
  isResponsive?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full max-w-lg sm:max-w-xl mx-auto min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 flex flex-col">
      {children}
    </div>
  );
};
