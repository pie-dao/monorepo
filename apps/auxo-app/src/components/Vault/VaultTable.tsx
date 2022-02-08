import React from "react";
import { useNavigate } from "react-router-dom";
import { USDCIcon } from "../../assets/icons/logos";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setSelectedVault } from "../../store/vault/vault.slice";
import { prettyNumber } from "../../utils";
import StyledButton from "../UI/button";

type VaultRowEntry = {
  value: any,
  icon?: React.ReactNode,
  isAction?: boolean
};
type VaultRow = Record<string, VaultRowEntry>;

const VaultTableActions = ({ vaultAddress }: { vaultAddress: string }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectVault = (vaultAddr: string): void => {
    dispatch(setSelectedVault(vaultAddr));
    navigate('/details');
  };
  return (
    <div className="flex w-full justify-end">
      <StyledButton 
        className="min-w-0 px-3 border-1 mx-1 text-sm"
        onClick={() => selectVault(vaultAddress)}
        >DEPOSIT
      </StyledButton>
    </div>
  )
}

const VaultTableHeaders = ({ headers }: { headers: string[] }) => {
  return (
    <thead className="
    bg-blue-200 
    w-full
    rounded-md
    ">
    <tr className="flex w-full items-center justify-between">
    { 
      headers.map((h, i) => <td key={h+i}
        className="
        w-full 
        flex 
        justify-between
        my-2
        pl-2
        capitalize  
        "
        >{h}</td>
      )
    }</tr>
  </thead>
  )
}

const VaultTableRowEntry = ({ item }: { item: VaultRowEntry }) => {
  return (
  <>{
    item.icon && 
      <div className="h-6 w-6 mr-2">
        {item.icon}
    </div>
  }
  {
    !item.isAction
      ? item.value
      : <VaultTableActions vaultAddress={item.value} />
  }</>
  )
}

const VaultTable = () => {
  const vaults = useAppSelector(state => state.vault.vaults);
  const vaultRows: VaultRow[] = vaults.map(v => ({
    deposit: {
      icon: <USDCIcon colors={{ bg: 'purple', primary: 'white' }} />,
      value: v.symbol,
    },
    yield: {
      value: (v.stats?.currentAPY ?? 'N/A') + ' %',
    },
      'total deposits': {
      value: '$ ' + prettyNumber(v.stats?.deposits.label) ?? '--',
    },
      'my deposit': {
      value: '$ ' + prettyNumber(v.userBalances?.vaultUnderlying.label) ?? '--',
    },
      '': {
      value: v.address,
      isAction: true
    }})
  );
  const headers = Object.keys(vaultRows[0]);
  return (
    <div className="overflow-x-auto ">
    <table className="
      table-auto
      w-full
      px-10
      flex
      flex-col
      items-center
      min-w-[700px]
      ">
      <VaultTableHeaders headers={headers} />
      <tbody className="w-full">
        {
          vaultRows.map((row, id) => {
            return <tr 
              key={id}
              className="flex w-full justify-between">
                {
                  Object.values(row).map((v, i) => {
                    return <td key={i}
                    className="
                      bg-white 
                      w-full 
                      flex
                      items-center 
                      justify-start
                      pl-2
                      my-2  
                      ">
                      <VaultTableRowEntry item={v} />
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