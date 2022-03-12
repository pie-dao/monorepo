import { useMemo } from "react";
import { CellProps, Column } from "react-table";
import { useAppSelector } from ".";
import StyledButton from "../components/UI/button";
import { prettyNumber, zeroApyMessage } from "../utils";
import { logoSwitcher } from "../utils/logos";
import { SUPPORTED_CHAINS } from "../utils/networks";
import { useNavigateToVault } from "./useSelectedVault";

export type TableRow = {
  address: string;
  network: keyof typeof SUPPORTED_CHAINS;
  deposit: string;
  yield: number;
  totalDeposits: number;
  myDeposits: number;
};

type TableCell = React.PropsWithChildren<CellProps<TableRow, string | number>>;

export const generateTextColor = (cell: TableCell): string => {
  const rowNumber = getSortedRowIndex(cell);
  return rowNumber > 5
    ? "text-gray-700"
    : ` text-return-${100 - 20 * rowNumber}`;
};

const getSortedRowIndex = (cell: TableCell) => {
  return cell.flatRows.indexOf(cell.row);
};

export const useTableData = (): {
  rows: TableRow[];
  headers: Column<TableRow>[];
} => {
  const vaults = useAppSelector((state) => state.vault.vaults);

  const rows = useMemo<TableRow[]>(
    () =>
      vaults.map((v) => ({
        address: v.address,
        network: v.network.name,
        deposit: v.symbol,
        yield: v.stats && v.token ? v.stats.currentAPY.label : 0,
        totalDeposits: v.stats?.deposits.label ?? 0,
        myDeposits: v.userBalances?.vaultUnderlying.label ?? 0,
      })),
    [vaults]
  );

  const headers = useMemo<Column<TableRow>[]>(
    () => [
      {
        accessor: "network",
        Header: "Network",
        filter: "includes",
      },
      {
        accessor: "deposit",
        Header: "Deposit",
        Cell: (cell: TableCell) => {
          // console.debug({ cell })
          const textColor = useMemo(() => generateTextColor(cell), [cell]);
          return (
            <div className="flex justify-start w-full items-center pl-5">
              <div className={`flex justify-start font-bold ${textColor}`}>
                <div className="mr-2 h-7 w-7 relative">
                  {logoSwitcher(cell.value as string)}
                </div>
                {cell.value}
              </div>
            </div>
          );
        },
      },
      {
        accessor: "yield",
        Header: "Yield",
        sortDescFirst: true,
        Cell: (cell) => {
          const textColor = useMemo(() => generateTextColor(cell), [cell]);
          return (
            <span className={`font-bold ${textColor}`}>
              {zeroApyMessage(cell.value)}
            </span>
          );
        },
      },
      {
        accessor: "totalDeposits",
        Header: "Total Deposits",
        sortDescFirst: true,
        Cell: ({ value }) => prettyNumber(value) ?? "--",
      },
      {
        accessor: "myDeposits",
        Header: "My Deposits",
        sortDescFirst: true,
        Cell: ({ value }) => prettyNumber(value) ?? "--",
      },
      {
        accessor: "address",
        Header: "",
        Cell: ({ value }) => {
          const navigate = useNavigateToVault();
          return (
            <StyledButton onClick={() => navigate(value)}>Deposit</StyledButton>
          );
        },
      },
    ],
    []
  );
  return {
    headers,
    rows,
  };
};
