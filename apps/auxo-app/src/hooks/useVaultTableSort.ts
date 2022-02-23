import { useAppSelector } from ".";
import { Sort, VaultRow, VaultRowReturnValue } from "../types/vaultTable";
import { prettyNumber, zeroApyMessage } from "../utils";
import { logoSwitcher } from "../utils/logos";

const useVaultRows = (): VaultRowReturnValue => {
  /**
   * Take the vaults and decompose into table-readable format, also return the headers
   */
  const vaults = useAppSelector((state) => state.vault.vaults);

  const rows = vaults.map((v) => ({
    address: v.address,
    data: {
      deposit: {
        sort: {
          value: v.symbol,
          isSortable: true,
        },
        icon: logoSwitcher(v.symbol),
        label: v.symbol,
        addStyles: true,
      },
      yield: {
        sort: {
          value: Number(v.stats?.currentAPY.value),
          isSortable: true,
        },
        label:
          v.stats && v.token
            ? zeroApyMessage(
                v.stats.currentAPY.label
              )
            : "--",
        addStyles: true,
      },
      "total deposits": {
        sort: {
          value: v.stats?.deposits.label,
          isSortable: true,
        },
        label: prettyNumber(v.stats?.deposits.label) ?? "--",
      },
      "my deposit": {
        sort: {
          value: v.userBalances?.vaultUnderlying.label,
          isSortable: true,
        },
        label: prettyNumber(v.userBalances?.vaultUnderlying.label) ?? "--",
      },
      "": {
        label: v.address,
        sort: {
          isSortable: false,
        },
        isAction: true,
      },
    } as VaultRow,
  }));

  const headers = Object.keys(rows[0].data);

  return {
    rows,
    headers,
  };
};

const sortRows = (
  rows: VaultRowReturnValue["rows"],
  sort: Sort
): VaultRowReturnValue["rows"] => {
  const headers = Object.keys(rows[0].data);
  const sortBy = headers[sort.index];

  return rows.sort((a: any, b: any) => {
    const sortByA = a.data[sortBy];
    const sortByB = b.data[sortBy];

    // require that the field is sortable
    if (!sortByA.sort.isSortable) return 1;

    // sort strings using localCompare
    if (
      typeof sortByA.sort.value === "string" &&
      typeof sortByB.sort.value === "string"
    ) {
      return (sort.asc ? sortByB : sortByA).sort.value.localeCompare(
        (sort.asc ? sortByA : sortByB).sort.value
      );
    }

    // sort numbers using regular a - b
    return (sort.asc ? 1 : -1) * (sortByA.sort.value - sortByB.sort.value);
  });
};

export const useSortedVaultRows = (sort: Sort): VaultRowReturnValue => {
  const { rows, headers } = useVaultRows();
  const rowsSorted = sortRows(rows, sort);
  return {
    rows: rowsSorted,
    headers,
  };
};
