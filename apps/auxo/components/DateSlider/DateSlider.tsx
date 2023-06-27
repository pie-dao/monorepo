import { useTodayPercentageBetweenTwoDates } from '../../hooks/useDifferenceBetweenTwoDates';

interface DateSliderProps {
  initialDate: number;
  endDate: number;
}

const DateSlider: React.FC<DateSliderProps> = ({ initialDate, endDate }) => {
  const percentage = useTodayPercentageBetweenTwoDates(initialDate, endDate);

  return (
    <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
      <div
        className="bg-secondary h-1.5 rounded-full animate-pulse"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default DateSlider;
