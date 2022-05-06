import { FaSort } from 'react-icons/fa';
import { Row, TableInstance } from 'react-table';
import { useNavigateToVault } from '../../../hooks/useSelectedVault';
import { VaultTableRow } from '../../../hooks/useVaultTableRows';

function VaultRow({
  row,
  prepareRow,
}: {
  row: Row<VaultTableRow>;
  prepareRow: (row: Row<VaultTableRow>) => void;
}): JSX.Element {
  prepareRow(row);
  const navigateToVault = useNavigateToVault();
  return (
    <tr
      {...row.getRowProps()}
      onClick={() => navigateToVault(row.original.address)}
      className="bg-white shadow-sm hover:border-gradient cursor-pointer hover:p-0"
    >
      {row.cells.map((cell) => {
        return (
          <td
            {...cell.getCellProps()}
            // adjust padding at corners for consistent hover gradient
            className="
            px-0 py-[2px] h-16
            first-of-type:rounded-tl-lg
            first-of-type:rounded-bl-lg                      
            last-of-type:rounded-tr-lg                                
            last-of-type:rounded-br-lg

            first-of-type:pl-[2px]
            last-of-type:pr-[2px]
          "
          >
            {cell.render('Cell')}
          </td>
        );
      })}
    </tr>
  );
}

function VaultTable({
  tableProps,
}: {
  tableProps: TableInstance<VaultTableRow>;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableProps;
  return (
    <section className="overflow-x-auto mx-2">
      <table
        {...getTableProps()}
        className="w-full min-w-[500px]"
        // spacing between rows
        style={{
          borderSpacing: '0 1em',
          borderCollapse: 'separate',
        }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="
            bg-baby-blue-light
              h-12
                    "
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  // rounded borders with border-collapse
                  className="
                  first-of-type:rounded-tl-lg
                  first-of-type:rounded-bl-lg
                  last-of-type:rounded-tr-lg                                
                  last-of-type:rounded-br-lg
                  text-gray-700
                "
                >
                  <div className="flex items-center justify-center">
                    {column.Header !== '' && (
                      <FaSort
                        className={`
                        mx-1
                        ${
                          column.isSorted &&
                          (column.isSortedDesc
                            ? 'fill-red-600'
                            : 'fill-green-600')
                        }
                      `}
                      />
                    )}
                    <p className="mr-2">{column.render('Header')}</p>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="p-2">
          {rows.map((row, id) => (
            <VaultRow key={id} row={row} prepareRow={prepareRow} />
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="my-5 text-gray-500">No Vaults for this Network</div>
      )}
    </section>
  );
}

export default VaultTable;
