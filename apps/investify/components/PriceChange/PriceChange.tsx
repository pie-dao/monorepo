import { formatAsPercent } from '../../utils/formatBalance';

const PriceChange = ({ amount }: { amount: number }) => {
  return amount > 0 ? (
    <span className="text-green">+ {formatAsPercent(amount)}</span>
  ) : amount === 0 ? (
    <span>0%</span>
  ) : (
    <span className="text-red">- {formatAsPercent(amount)}</span>
  );
};

export default PriceChange;
