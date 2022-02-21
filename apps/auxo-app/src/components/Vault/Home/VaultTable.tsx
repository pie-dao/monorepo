import React, { useState } from "react";
import { FaSort } from "react-icons/fa";
import { useAppSelector } from "../../../hooks";
import { useNavigateToVault } from "../../../hooks/useSelectedVault";
import { prettyNumber, zeroApyMessage } from "../../../utils";
import { logoSwitcher } from "../../../utils/logos";
import StyledButton from "../../UI/button";

type VaultRowEntry = {
  value: any,
  addStyles?: boolean,
  icon?: React.ReactNode,
  isAction?: boolean
};

type VaultRow = Record<string, VaultRowEntry>;

const VaultTableActions = ({ vaultAddress }: { vaultAddress: string }) => {
  const selectVault = useNavigateToVault();
  return (
    <div className="flex w-full justify-end">
      <StyledButton 
        className="min-w-0 px-5 border-1 mx-3 rounded-xl"
        onClick={() => selectVault(vaultAddress)}
        >DEPOSIT
      </StyledButton>
    </div>
  )
}

const VaultTableHeaders = ({ headers }: { headers: string[] }) => {
  const [selected, setSelected] = useState(0) 
  return (
    <thead className="
    bg-baby-blue-light 
    w-full
    mt-4
    mb-2
    rounded-lg
    ">
    <tr className="flex w-full items-center justify-between">
    { 
      headers.map((h, i) => <td key={h+i}
        className="
          w-full 
          flex
          text-gray-600 
          justify-start
          my-2
          text-md
          py-1
          items-center
          pl-2
          capitalize  
        "
        onClick={() => setSelected(i)}
        >
          {h &&<FaSort className={`mr-2 ${selected === i && 'fill-green-600'}`} />}{h}
        </td>
      )
    }</tr>
  </thead>
  )
}

const VaultTableRowEntry = ({ item, rowNumber }: { item: VaultRowEntry, rowNumber: number }) => {
  const getTextColorFromOrder = (): string => {
    const textColor = rowNumber > 5 ? 'text-gray-600' : ` text-return-${100 - 20 * rowNumber}`;
    return textColor
  };
  return (
  <>{
    item.icon && 
      <div className="h-8 w-8 mr-2">
        {item.icon}
    </div>
  }
  {
    !item.isAction
      ? <p className={`md:text-xl ml-1 ${ item.addStyles && ('font-bold ' + getTextColorFromOrder())}`}>{item.value}</p>
      : <VaultTableActions vaultAddress={item.value} />
  }</>
  )
}

const useVaultRows = (): { rows: { address: string, data: VaultRow }[], headers: Array<keyof VaultRow> } => {
  /**
   * Take the vaults and decompose into table-readable format, also return the headers
   */
  const vaults = useAppSelector(state => state.vault.vaults);
  const rows = vaults.map(v => ({
    address: v.address,
    data: {
      deposit: {
        icon: logoSwitcher(v.symbol),
        value: v.symbol,
        addStyles: true,
      },
      yield: {
        value: (v.stats && v.token) ? zeroApyMessage(Number(v.stats?.currentAPY.value) / (10 ** v.token.decimals)) : '--',
        addStyles: true
      },
        'total deposits': {
        value: prettyNumber(v.stats?.deposits.label) ?? '--',
      },
        'my deposit': {
        value: prettyNumber(v.userBalances?.vaultUnderlying.label) ?? '--',
      },
        '': {
        value: v.address,
        isAction: true
      }
    }})
  );
  return {
    rows,
    headers: Object.keys(rows[0].data)
  }
}

const VaultTable = () => {
  const { rows, headers } = useVaultRows();
  const selectVault = useNavigateToVault();
  return (
    <div className="overflow-x-auto ">
    <table className="
      table-auto
      w-full
      flex
      flex-col
      items-center
      min-w-[700px]
      px-3 md:px-0
      ">
      <VaultTableHeaders headers={headers} />
      <tbody className="w-full">
        {
          rows.map((row, rowNumber) => {
            return <tr 
              onClick={() => selectVault(row.address) }
              key={rowNumber}
              className="
                flex w-full justify-between
                my-2
                rounded-xl
                bg-white
                p-[2px]
                hover:border-gradient
                hover:shadow-md
              ">
                {
                  Object.values(row.data).map((item, itemNumber) => {
                    return <td key={itemNumber}
                    className="
                      py-2
                      w-full
                      cursor-pointer
                      flex
                      h-16
                      px-3
                      items-center 
                      justify-start
                      pl-2
                      ">
                      <VaultTableRowEntry item={item} rowNumber={rowNumber}/>
                    </td>
                  }
                  )
                }
            </tr>
            }
          )
        }
      </tbody>
    </table>
    </div>
  )
}

export default VaultTable;