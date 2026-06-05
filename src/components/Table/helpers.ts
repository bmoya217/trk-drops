import { Grouping, type Row } from "../../lib/types";

export const getDefaultTableSortColumn = (grouping: Grouping) => {
  if (grouping === Grouping.Player) return "DPS";

  return "Player";
};

export const getVisibleTableColumns = ({
  armorHeadCells,
  column,
  grouping,
  headCells,
  isLargeScreen,
}: {
  armorHeadCells: string[];
  column: string;
  grouping: Grouping;
  headCells: string[];
  isLargeScreen: boolean;
}) => {
  if (grouping === Grouping.Player) return ["Item", "DPS"];
  if (isLargeScreen) return armorHeadCells;

  return [headCells[0], column];
};

export const getSlot = (row: Row) =>
  Object.keys(row).find(
    (key) => key !== "Item" && key !== "color" && key !== "classId",
  ) ?? "";

export const getPlayerTableRows = (rows: Row[]) =>
  rows.map((row): Row => {
    const slot = getSlot(row);

    return {
      ...row,
      Slot: slot,
      DPS: row[slot],
    };
  });

export const getVisibleTableRows = ({
  bossRows,
  column,
  grouping,
  isLargeScreen,
  rows,
  slots,
}: {
  bossRows: Row[];
  column: string;
  grouping: Grouping;
  isLargeScreen: boolean;
  rows: Row[];
  slots: string[];
}) => {
  if (grouping === Grouping.Player) {
    return getPlayerTableRows(rows).filter(
      (row) => !slots.length || slots.includes(`${row.Slot}`),
    );
  }

  if (isLargeScreen) return bossRows;

  return rows.filter((row) => row[column]);
};
