import { ReactNode } from 'react';

const GradientBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
      <div className="bg-gradient-to-r from-white via-white to-background px-4 py-1 rounded-md">
        {children}
      </div>
    </div>
  );
};

export default GradientBox;
