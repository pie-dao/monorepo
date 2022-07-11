import { smallToBalance } from '../../utils/formatBalance';
import { useDecimals } from '../../hooks/useSelectedVault';
import { BigNumberReference } from '../../store/products/products.types';
import { SetStateType } from '../../types/utilities';
import { zeroBalance } from '../../utils/balances';
import { useCallback } from 'react';

function InputSlider({
  value,
  setValue,
  max,
  label,
}: {
  setValue: SetStateType<BigNumberReference>;
  value: BigNumberReference;
  max: BigNumberReference;
  label: string;
}): JSX.Element {
  const decimals = useDecimals();

  const handleChange = (value: string | undefined) => {
    if (!decimals) return;
    if (!value) setValue(zeroBalance);

    const maximizedBNValue = smallToBalance(Number(value), decimals);

    setValue(maximizedBNValue);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <div className="flex flex-col items-start focus-within:ring-2 ring-secondary rounded-xl border border-custom-border bg-white">
          <input
            type="number"
            min="0"
            className="border-none leading-5 font-medium text-3xl text-primary rounded-xl focus:outline-none focus:ring-0 block w-full [appearance:textfield]"
            value={value.label.toString()}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button
            onClick={() => setValue(max)}
            disabled={max.value === '0'}
            className="text-secondary text-xs font-medium leading-3 px-3 pt-1 pb-3"
          >
            <span className="text-sub-dark">{`${max.label} ${label} `}</span>
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputSlider;
