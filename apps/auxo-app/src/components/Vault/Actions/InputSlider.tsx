import { BigNumber, ethers } from 'ethers';
import { Range, getTrackBackground } from 'react-range';
import { useDecimals } from '../../../hooks/useSelectedVault';
import { Balance } from '../../../store/vault/Vault';
import { SetStateType } from '../../../types/utilities';
import { smallToBalance } from '../../../utils';
import { zeroBalance } from '../../../utils/balances';

function RangeWrapper({
  max,
  value,
  setValue,
}: {
  max: Balance;
  value: Balance;
  setValue: SetStateType<Balance>;
}) {
  const thumbSize = '24px';
  const trackColor = '#7065F4';
  const decimals = useDecimals();

  const onChange = (v: number[]): void => {
    const changeBalance = smallToBalance(v[0], decimals);
    const roundingError = BigNumber.from(max.value)
      .sub(changeBalance.value)
      .isNegative();
    roundingError ? setValue(max) : setValue(changeBalance);
  };

  return (
    <Range
      disabled={max.label < 1}
      min={0}
      max={max.value === '0' ? 1 : max.label}
      values={[value.label]}
      onChange={onChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '8px',
            width: '100%',
            backgroundColor: '#FFF',
            borderRadius: '10px',
            background: getTrackBackground({
              values: [value.label],
              colors: [trackColor, '#FFF'],
              min: 0,
              max: max.label,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        // taken straight from the docs but still throws TS error, happy to ignore
        // @ts-ignore
        <div
          {...props}
          style={{
            ...props.style,
            height: thumbSize,
            width: thumbSize,
            borderRadius: '100%',
            backgroundColor: max.label < 1 ? 'gray' : trackColor,
          }}
        />
      )}
    />
  );
}

function InputSlider({
  value,
  setValue,
  max,
  label,
}: {
  setValue: SetStateType<Balance>;
  value: Balance;
  max: Balance;
  label: string;
}): JSX.Element {
  const decimals = useDecimals();

  const handleChange = (value: string | undefined, max: number) => {
    if (!decimals) return;
    if (!value) setValue(zeroBalance());

    // Only supports integer values at this current time
    // Mostly due to additional logic required for on-chain fetching decimals
    const maximisedValue = Math.round(Math.min(Number(value), max));

    setValue({
      label: maximisedValue,
      value: ethers.utils
        .parseUnits(maximisedValue.toString(), decimals)
        .toString(),
    });
  };

  return (
    <div
      className="
            bg-baby-blue-light rounded-xl px-1 py-7
            flex flex-col items-center w-full
        "
    >
      <div
        className="
              hide-arrows
              w-full"
      >
        <input
          type="number"
          min="0"
          max={max.label}
          className="
                  focus:outline-none w-full bg-transparent text-center
                  text-5xl font-bold text-baby-blue-dark
                  underline decoration-white underline-offset-4 mb-2 
                  "
          value={value.label.toString()}
          onChange={(e) => handleChange(e.target.value, max.label)}
        />
      </div>
      <p className="text-baby-blue-dark">{label}</p>
      <div className="w-full px-2 my-5">
        <RangeWrapper max={max} value={value} setValue={setValue} />
      </div>
      <button
        onClick={() => setValue(max)}
        disabled={max.label < 1}
        className="
                text-baby-blue-dark
                font-bold
                border-4 
                border-white
                rounded-lg
                px-4
                py-1
                disabled:text-gray-300
                "
      >
        MAX
      </button>
    </div>
  );
}

export default InputSlider;
