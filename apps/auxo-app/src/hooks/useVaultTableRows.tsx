import { useMemo } from 'react';
import { CellProps, Column, TableState } from 'react-table';
import { useAppSelector } from '.';
import StyledButton from '../components/UI/button';
import { Vault } from '../store/vault/Vault';
import { prettyNumber, zeroApyMessage } from '../utils';
import { logoSwitcher } from '../utils/logos';
import {
  chainMap,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_NAMES,
} from '../utils/networks';
import { useNavigateToVault } from './useSelectedVault';

export type VaultTableRow = {
  chainId: number;
  address: string;
  network: SUPPORTED_CHAIN_NAMES;
  deposit: string;
  yield: number;
  totalDeposits: number;
  myDeposits: number;
};

type VaultTableCell = React.PropsWithChildren<
  CellProps<VaultTableRow, string | number>
>;

// Generate a gradient of text colors based on the row index of the cell in the table
// requires tailwind.config is configured not to prune the string interpolated colors
export const generateTextColor = (cell: VaultTableCell): string => {
  const rowNumber = getSortedRowIndex(cell);
  return rowNumber > 5
    ? ' text-gray-700'
    : ` text-return-${100 - 20 * rowNumber}`;
};

// Index of row after having sorted
const getSortedRowIndex = (cell: VaultTableCell) => {
  return cell.flatRows.indexOf(cell.row);
};

// Fetch the symbol of the network, so we can display next to the deposit token
const getNetworkTokenSymbolForCell = (cell: VaultTableCell): string => {
  const rows = cell.row.allCells;
  const chainIdCell = rows.find((r) => r.column.id === 'chainId')!;
  const chainID = chainIdCell.value;
  const symbol = chainMap[chainID as SUPPORTED_CHAIN_ID].nativeCurrency.symbol;
  return symbol;
};

const getVaultTableRow = (v: Vault): VaultTableRow => ({
  chainId: v.network.chainId,
  address: v.address,
  network: v.network.name,
  deposit: v.symbol,
  yield: v.stats && v.token ? v.stats.currentAPY.label : 0,
  totalDeposits: v.stats?.deposits.label ?? 0,
  myDeposits: v.userBalances?.vaultUnderlying.label ?? 0,
});

// Show the deposit token Icon, currency and network symbol inside the cell
export const DepositCell = ({
  cell,
}: {
  cell: VaultTableCell;
}): JSX.Element => {
  const textColor = useMemo(() => generateTextColor(cell), [cell]);
  const symbol = useMemo(() => getNetworkTokenSymbolForCell(cell), [cell]);
  return (
    <div className="flex justify-evenly w-full items-center">
      <div
        className={`flex justify-start md:justify-between w-24 font-bold ${textColor}`}
      >
        <div className="mr-2 h-8 w-8 relative flex justify-start">
          {logoSwitcher(cell.value as string)}
          <div className="h-4 w-4 absolute -bottom-1 -right-1">
            {logoSwitcher(symbol)}
          </div>
        </div>
        <p className="pt-1">{cell.value}</p>
      </div>
    </div>
  );
};

const ToVaultDepositButton = ({
  address,
}: {
  address: string;
}): JSX.Element => {
  const navigate = useNavigateToVault();
  return (
    <StyledButton
      onClick={() => navigate(address)}
      className="flex justify-evenly items-center"
    >
      Deposit
    </StyledButton>
  );
};

// Control settings of table on first load
export const initialTableState: Partial<TableState<VaultTableRow>> = {
  hiddenColumns: ['network', 'chainId'],
  sortBy: [
    {
      id: 'yield',
      desc: true,
    },
  ],
};

/**
 * React table allows controlling MOST table behaviour by adjusting the columns only.
 * Pass the accessor matching the vault row name as an indentifier, the Header is the name of the column
 * as it appears to the user, then you can add other behaviour as per the documentation.
 *
 * The Cell property allows us to apply any transformations on the raw data. We can either do some field formatting
 * Or return a JSX element and take full control of the rendering.
 */
export const useVaultTableData = (): {
  rows: VaultTableRow[];
  headers: Column<VaultTableRow>[];
} => {
  const vaults = useAppSelector((state) => state.vault.vaults);

  const rows = useMemo<VaultTableRow[]>(
    () => vaults.map((v) => getVaultTableRow(v)),
    [vaults],
  );

  const headers = useMemo<Column<VaultTableRow>[]>(
    () => [
      {
        accessor: 'chainId',
        Header: 'Chain Id',
      },
      {
        accessor: 'network',
        Header: 'Network',
        filter: 'includes',
      },
      {
        accessor: 'deposit',
        Header: 'Deposit',
        Cell: (cell): JSX.Element => <DepositCell cell={cell} />,
      },
      {
        accessor: 'yield',
        Header: 'Yield',
        sortDescFirst: true,
        Cell: (cell): JSX.Element => {
          const textColor = useMemo(() => generateTextColor(cell), [cell]);
          return (
            <span className={`font-bold ${textColor}`}>
              {zeroApyMessage(cell.value)}
            </span>
          );
        },
      },
      {
        accessor: 'totalDeposits',
        Header: 'Total Deposits',
        sortDescFirst: true,
        Cell: ({ value }): string => prettyNumber(value) ?? '--',
      },
      {
        accessor: 'myDeposits',
        Header: 'My Deposits',
        sortDescFirst: true,
        Cell: ({ value }): string => prettyNumber(value) ?? '--',
      },
      {
        accessor: 'address',
        Header: '',
        Cell: ({ value }) => <ToVaultDepositButton address={value} />,
      },
    ],
    [],
  );
  return {
    headers,
    rows,
  };
};
