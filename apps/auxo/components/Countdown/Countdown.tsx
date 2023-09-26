import React, { useMemo } from 'react';
import useCountdown from '../../hooks/useCountdown';

interface CountdownProps {
  date: string;
}

const Countdown: React.FC<CountdownProps> = ({ date }) => {
  const dateUntilNextState = useMemo(() => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate) ? new Date(parsedDate) : null;
  }, [date]);

  // Use the countdown hook
  const counter = useCountdown(dateUntilNextState);

  return (
    <div className=" text-primary font-semibold text-2xl">
      {dateUntilNextState === null ? null : <p>{counter}</p>}
    </div>
  );
};

export default Countdown;
