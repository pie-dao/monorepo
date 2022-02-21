import { useState } from "react";
import { FaSort } from "react-icons/fa";
import { useNavigateToVault } from "../../../hooks/useSelectedVault";
import { useSortedVaultRows } from "../../../hooks/useVaultTableSort";
import { SetStateType } from "../../../types/utilities";
import { Sort, VaultRowEntry } from "../../../types/vaultTable";
import StyledButton from "../../UI/button";

const VaultTableActions = ({ vaultAddress }: { vaultAddress: string }) => {
  const selectVault = useNavigateToVault();
  return (
    <div className="flex w-full justify-end">
      <StyledButton 
        className="min-w-0 px-5 border-1 mx-3 rounded-lg"
        onClick={() => selectVault(vaultAddress)}
        >DEPOSIT
      </StyledButton>
    </div>
  )
}

const VaultTableHeaders = ({ headers, sort, setSort }: { headers: string[], sort: Sort, setSort: SetStateType<Sort> }) => {
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
        onClick={() => setSort({
          index: i,
          asc: false
        })}
        >
          {h &&<FaSort className={`mr-2 ${sort.index === i && (!sort.asc ? 'fill-green-600' : 'fill-red-600' ) }`} />}{h}
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
      ? <p className={`md:text-xl ml-1 ${ item.addStyles && ('font-bold ' + getTextColorFromOrder())}`}>{item.label}</p>
      : <VaultTableActions vaultAddress={item.label} />
  }</>
  )
}


const VaultTable = (): JSX.Element => {
  const [sort, setSort] = useState<Sort>({
    index: 1,
    asc: false
  });
  const selectVault = useNavigateToVault();
  const { rows, headers } = useSortedVaultRows(sort)
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
      <VaultTableHeaders headers={headers} sort={sort} setSort={setSort}/>
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