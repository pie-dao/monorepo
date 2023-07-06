import { ReactNode } from 'react';

const GradientBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col p-[2px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full">
      <div className="bg-gradient-to-r from-white via-white to-background p-2.5 rounded-md">
        {children}
      </div>
    </div>
  );
};

export default GradientBox;
