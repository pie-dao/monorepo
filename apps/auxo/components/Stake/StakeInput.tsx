import Image from 'next/image';
import { useState } from 'react';
import { formatBalance, smallToBalance } from '../../utils/formatBalance';
import { useDecimals } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { SetStateType } from '../../types/utilities';
import { zeroBalance } from '../../utils/balances';
import classNames from '../../utils/classnames';
import { useAppSelector } from '../../hooks';
import wallet from '../../public/images/icons/wallet.svg';
import { escapeRegExp, inputRegex } from '../../utils/sanitizeInput';

function InputSlider({
  value,
  setValue,
  max,
  label,
  disabled = false,
}: {
  setValue: SetStateType<BigNumberReference>;
  value: BigNumberReference;
  max: BigNumberReference;
  label: string;
  disabled?: boolean;
}): JSX.Element {
  const decimals = useDecimals(label);
  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const [displayValue, setDisplayValue] = useState<string>('0');

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      handleChange(nextUserInput);
    }
  };

  const handleChange = (value: string | undefined) => {
    if (!decimals) return;
    if (!value) {
      setValue(zeroBalance);
      setDisplayValue(undefined);
      return;
    }

    if (value.startsWith('.')) {
      setDisplayValue('0.');
      const maximizedBNValue = smallToBalance('0', decimals);
      setValue(maximizedBNValue);
      return;
    }

    if (value.endsWith('.')) {
      setDisplayValue(value);
      const maximizedBNValue = smallToBalance(value.slice(0, -1), decimals);
      setValue(maximizedBNValue);
      return;
    }

    const maximizedBNValue = smallToBalance(value, decimals);
    setValue(maximizedBNValue);
    setDisplayValue(value);
  };

  return (
    <div
      className={classNames(
        disabled && 'pointer-events-none cursor-not-allowed',
        'flex flex-col items-center w-full mb-2',
      )}
    >
      <div className="w-full">
        <div className="flex flex-col items-start focus-within:ring-2 ring-secondary rounded-xl border border-custom-border bg-white">
          <input
            className="border-none leading-5 font-medium text-3xl text-primary rounded-xl focus:outline-none focus:ring-0 block w-full [appearance:textfield]"
            value={displayValue}
            onChange={(e) => enforcer(e.target.value.replace(/,/g, '.'))}
            disabled={disabled}
            // universal input options
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            // text-specific options
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={'0'}
            minLength={1}
            maxLength={79}
            spellCheck="false"
          />
          <button
            onClick={() => {
              setValue(max);
              setDisplayValue(max.label.toString());
            }}
            disabled={max.value === '0'}
            className="flex text-secondary text-xs font-medium leading-3 px-3 pt-1 pb-3 gap-x-1"
            data-cy="max-button"
          >
            <Image src={wallet} alt="wallet" width={12} height={12} priority />
            <span className="text-sub-dark">{`${formatBalance(
              max.label,
              defaultLocale,
              4,
              'standard',
            )} ${label}`}</span>
            <span>MAX</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputSlider;
