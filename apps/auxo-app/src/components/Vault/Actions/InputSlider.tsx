import { Range, getTrackBackground } from 'react-range';
import { useSelectedVault } from "../../../hooks/useSelectedVault";
import { Balance } from "../../../store/vault/Vault";
import { SetStateType } from "../../../types/utilities";
import { smallToBalance, toBalance, toScale } from "../../../utils";

const useDecimals = (): number => {
  const vault = useSelectedVault();
  return vault?.token.decimals ?? 0
}

function RangeWrapper({ max, value, setValue }: { max: Balance, value: Balance, setValue: SetStateType<Balance>}) {
    const thumbSize = '24px';
    const decimals = useDecimals();

    // library requires a number but this can cause big number underflows
    const safeMax = Math.round(max.label);
    
    return (
      <Range
        disabled={safeMax === 0}
        min={0}
        max={safeMax === 0 ? 1 : safeMax}
        values={[value.label]}
        onChange={v => setValue(
          smallToBalance(
            v[0], decimals)
          )}
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
                colors: ["#7065F4", "#FFF"],
                min: 0,
                max: safeMax
              })              
            }}
          >
              { children }
              </div>
        )}
        renderThumb={({ props }) => (
          // @ts-ignore
          <div
            {...props}
            style={{
              ...props.style,
              height: thumbSize,
              width: thumbSize,
              borderRadius: '100%',
              backgroundColor: '#7065F4' 
            }}
          />
        )}
      />                
    )
}

function InputSlider({ value, setValue, max, label }: {
  setValue: SetStateType<Balance>,
  value: Balance,
  max: Balance
  label: string
}): JSX.Element {
    return (
        <div className="
            bg-baby-blue-light rounded-xl px-1 py-7
            flex flex-col items-center w-full
        ">
            <p className="
                text-5xl font-bold text-baby-blue-dark
                underline decoration-white underline-offset-4 mb-2"
            >{value.label}</p>
            <p className="text-baby-blue-dark">{label}</p>
            <div className="w-full px-2 my-5">
                <RangeWrapper max={max} value={value} setValue={setValue} />
            </div>
        </div>
    )
}

export default InputSlider