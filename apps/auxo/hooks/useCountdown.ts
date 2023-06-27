import { useState, useEffect } from 'react';
import moment from 'moment';

const useCountdown = (myDate: Date) => {
  const [counter, setCounter] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const targetDate = moment(myDate);
      const duration = moment.duration(targetDate.diff(now));

      const months = Math.floor(duration.asMonths());
      duration.subtract(months, 'months');

      const days = Math.floor(duration.asDays());
      duration.subtract(days, 'days');

      const hours = Math.floor(duration.asHours());
      duration.subtract(hours, 'hours');

      const minutes = Math.floor(duration.asMinutes());

      if (months < 0 || days < 0 || hours < 0 || minutes < 0) {
        setCounter('Activating...');
      } else {
        setCounter(`${months}M ${days}D ${hours}H ${minutes}M`);
      }
    };

    const timer = setInterval(calculateTimeLeft, 60000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [myDate]);

  return counter;
};

export default useCountdown;
