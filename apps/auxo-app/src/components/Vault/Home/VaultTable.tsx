import { FaSort } from "react-icons/fa";
import { TableInstance } from "react-table";
import { useNavigateToVault } from "../../../hooks/useSelectedVault";
import { TableRow } from "../../../hooks/useVaultTableSort";

function VaultTable({ tableProps }: { tableProps: TableInstance<TableRow> }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableProps;
  const navigateToVault = useNavigateToVault();
  return (
    <table
      {...getTableProps()}
      className="w-full"
      style={{
        borderSpacing: "0 1em",
        borderCollapse: "separate",
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
                className="
                                first-of-type:rounded-tl-lg
                                first-of-type:rounded-bl-lg
                            
                                last-of-type:rounded-tr-lg                                
                                last-of-type:rounded-br-lg

                                text-gray-700
                                "
              >
                <div className="flex items-center justify-center">
                  {column.Header !== "" && (
                    <FaSort
                      className={`
                                    mx-1
                                    ${
                                      column.isSorted &&
                                      (column.isSortedDesc
                                        ? "fill-red-600"
                                        : "fill-green-600")
                                    }
                                `}
                    />
                  )}
                  <p className="mr-2">{column.render("Header")}</p>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="p-2">
        {rows.map((row) => {
          prepareRow(row);
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
                    // rounded borders with border-collapse
                    className="
                                            px-0 py-[2px] h-16
                                            first-of-type:rounded-tl-lg
                                            first-of-type:rounded-bl-lg
                                            first-of-type:pl-[2px]
                                            
                                            last-of-type:rounded-tr-lg                                
                                            last-of-type:rounded-br-lg
                                            last-of-type:pr-[2px]
                                            "
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default VaultTable;
