import { useState, useEffect } from 'react';
import Image from 'next/image';
import AUXOBig from '../../public/images/AUXOBig.svg';

const PendingTransaction: React.FC = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(
      () => setDots((prev) => (prev.length < 3 ? prev + '.' : '.')),
      500,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Image src={AUXOBig} alt={'auxo'} width={90} height={83} />
      <span className="text-primary text-base font-medium w-20">
        Pending{dots}
      </span>
    </>
  );
};

export default PendingTransaction;
