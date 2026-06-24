import { createSelector } from "@reduxjs/toolkit";
import {
  Grouping,
  Order,
  View,
  type ArmorType,
  type ByDifficulty,
  type Difficulty,
  type Links,
  type Row,
} from "../lib/types";
import {
  filterRowsByArmorTypes,
  formatSlot,
  getComparator,
  getColumns,
  getLink,
} from "../lib/utils";
import type { RootState } from ".";
import { dataSlice } from "./slices/dataSlice";

const { selectors } = dataSlice;

const getSelectedFilterLabel = (label: string, values: string[]) => {
  if (!values.length) return label;
  if (values.length === 1) return `${label}: ${values[0]}`;

  return `${label} (${values.length})`;
};

export const selectHeaderModel = createSelector(
  [
    selectors.selectArmorTypes,
    selectors.selectColumn,
    selectors.selectData,
    selectors.selectDifficulty,
    selectors.selectGroup,
    selectors.selectGrouping,
    selectors.selectGroups,
    selectors.selectColumns,
    selectors.selectLoading,
    selectors.selectSlots,
    selectors.selectView,
  ],
  (
    armorTypes,
    column,
    data,
    difficulty,
    group,
    grouping,
    groups,
    columns,
    loading,
    slots,
    view,
  ) => {
    const hasGroup = Boolean(!loading && group && groups.length);
    const hasMultipleColumns = columns.length > 1;
    const isBossTable = grouping === Grouping.Boss && view === View.Table;
    const isPlayerTable = grouping === Grouping.Player && view === View.Table;
    const columnOptions = columns.slice(1);
    const itemSlots =
      grouping === Grouping.Boss
        ? getItemSlots(Object.values(data[difficulty].Player).flat())
        : {};

    return {
      armorLabel: getSelectedFilterLabel("Armor", armorTypes),
      armorTypes,
      column,
      columnLabel: grouping === Grouping.Boss ? "Item" : "Slot",
      group,
      grouping,
      groups,
      isBossTable,
      showArmor:
        hasGroup &&
        grouping === Grouping.Boss &&
        (view === View.List || isBossTable),
      showColumn:
        hasGroup && hasMultipleColumns && (view === View.Chart || isBossTable),
      showGroup: hasGroup,
      showSlot: isPlayerTable && hasMultipleColumns,
      slotLabel: getSelectedFilterLabel("Slot", slots.map(formatSlot)),
      slots,
      columnOptions,
      slotByOption: Object.fromEntries(
        columnOptions.map((value) => [value, getBossItemSlot(value, itemSlots)]),
      ),
    };
  },
);

export const selectRaidbotsLink = createSelector(
  [selectors.selectGroup, selectors.selectDifficulty, selectors.selectLinks],
  (group, difficulty, links) => links[`${group}_${difficulty}`],
);

export const selectChartModel = createSelector(
  [
    selectors.selectRows,
    selectors.selectColumn,
    selectors.selectDifficulty,
    selectors.selectLinks,
    selectors.selectLoading,
  ],
  (rows, column, difficulty, links, loading) => {
    const chartRows = rows
      .slice()
      .sort(getComparator(Order.desc, column))
      .filter((row) => row[column] !== undefined);

    return {
      column,
      chartRows,
      difficulty,
      links,
      loading,
      yLabel: chartRows[0]?.Player ? "Player" : "Item",
    };
  },
);

const getPlayerTableRows = (rows: Row[]) =>
  rows.map((row): Row => {
    const slot =
      Object.keys(row).find(
        (key) => key !== "Item" && key !== "color" && key !== "classId",
      ) ?? "";

    return { ...row, Slot: slot, DPS: row[slot] };
  });

const selectArmorRows = createSelector(
  [selectors.selectRows, selectors.selectArmorTypes],
  filterRowsByArmorTypes,
);

const selectArmorColumns = createSelector(
  [selectArmorRows, selectors.selectGrouping],
  getColumns,
);

const selectIsLargeScreen = (_: RootState, isLargeScreen: boolean) =>
  isLargeScreen;

export const selectVisibleTableColumns = createSelector(
  [
    selectArmorColumns,
    selectors.selectColumn,
    selectors.selectGrouping,
    selectors.selectColumns,
    selectIsLargeScreen,
  ],
  (armorColumns, column, grouping, columns, isLargeScreen) => {
    if (grouping === Grouping.Player) return ["Item", "DPS"];
    if (isLargeScreen) return armorColumns;

    return [columns[0], column];
  },
);

export const selectTableHeadModel = createSelector(
  [
    selectVisibleTableColumns,
    selectors.selectDifficulty,
    selectors.selectGrouping,
    selectors.selectLinks,
  ],
  (columns, difficulty, grouping, links) =>
    columns.map((name) => ({
      name,
      link:
        grouping === Grouping.Player
          ? undefined
          : links[`${name}_${difficulty}`],
    })),
);

const selectVisibleTableRows = createSelector(
  [
    selectArmorRows,
    selectors.selectColumn,
    selectors.selectGrouping,
    selectIsLargeScreen,
    selectors.selectRows,
    selectors.selectSlots,
  ],
  (bossRows, column, grouping, isLargeScreen, rows, slots) => {
    if (grouping === Grouping.Player) {
      return getPlayerTableRows(rows).filter(
        (row) => !slots.length || slots.includes(`${row.Slot}`),
      );
    }
    if (isLargeScreen) return bossRows;

    return rows.filter((row) => row[column] !== undefined);
  },
);

const selectOrder = (_: RootState, _isLargeScreen: boolean, order: Order) =>
  order;
const selectOrderBy = (
  _: RootState,
  _isLargeScreen: boolean,
  _order: Order,
  orderBy: string,
) => orderBy;

export const selectTableBodyModel = createSelector(
  [
    selectVisibleTableColumns,
    selectVisibleTableRows,
    selectors.selectDifficulty,
    selectors.selectGrouping,
    selectors.selectColumns,
    selectors.selectLinks,
    selectors.selectLoading,
    selectOrder,
    selectOrderBy,
  ],
  (
    columns,
    rows,
    difficulty,
    grouping,
    allColumns,
    links,
    loading,
    order,
    orderBy,
  ) => ({
    columns,
    emptyColSpan: allColumns.length,
    isPlayerView: grouping === Grouping.Player,
    rows: rows
      .slice()
      .sort(getComparator(order, orderBy))
      .map((row) => ({ row, link: getLink(row, difficulty, links) })),
    showEmpty: !rows.length && !loading,
  }),
);

export const LIST_SLOT_ORDER = [
  "head",
  "neck",
  "shoulder",
  "back",
  "chest",
  "wrist",
  "hands",
  "waist",
  "legs",
  "feet",
  "finger",
  "trinket",
  "one-hand",
  "two-hand",
  "off hand",
  "held in off-hand",
  "ranged",
];

const LIST_META_KEYS = new Set(["Item", "Player", "color", "classId"]);
const getListSlot = (row: Row) =>
  Object.keys(row).find((key) => !LIST_META_KEYS.has(key)) ?? "";
const getSlotOrder = (slot: string) => {
  const index = LIST_SLOT_ORDER.indexOf(slot.toLowerCase());
  return index === -1 ? LIST_SLOT_ORDER.length : index;
};
const getItemSlots = (rows: Row[]) =>
  rows.reduce<Record<string, string>>((slots, row) => {
    const item = row.Item as string;
    const slot = getListSlot(row);
    return item && slot ? { ...slots, [item]: slot } : slots;
  }, {});
const getBossItemSlot = (item: string, slots: Record<string, string>) =>
  slots[item] ?? (item.endsWith(" tier") ? item.replace(" tier", "") : "");

const getPlayerListItems = (
  rows: Row[],
  difficulty: Difficulty,
  links: Links,
) =>
  rows
    .map((row) => {
      const slot = getListSlot(row);
      return {
        item: row.Item as string,
        link: getLink(row, difficulty, links),
        slot,
        value: row[slot],
      };
    })
    .filter((item) => item.item && item.slot)
    .sort((a, b) => {
      const slotDiff = getSlotOrder(a.slot) - getSlotOrder(b.slot);
      return slotDiff || Number(b.value ?? 0) - Number(a.value ?? 0);
    });

const getBossListItems = (
  rows: Row[],
  armorTypes: ArmorType[],
  data: ByDifficulty,
  difficulty: Difficulty,
  links: Links,
) => {
  const bossRows = filterRowsByArmorTypes(rows, armorTypes);
  const itemSlots = getItemSlots(Object.values(data[difficulty].Player).flat());

  return getColumns(bossRows, Grouping.Boss)
    .slice(1)
    .map((item) => {
      const players = bossRows
        .filter((row) => row[item] !== undefined)
        .map((row) => ({
          color: row.color as string,
          link: getLink(row, difficulty, links),
          player: row.Player as string,
          value: row[item],
        }))
        .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));

      return {
        item,
        link: links[`${item}_${difficulty}`],
        players,
        slot: getBossItemSlot(item, itemSlots),
      };
    })
    .filter((item) => item.players.length);
};

export const selectListModel = createSelector(
  [
    selectors.selectRows,
    selectors.selectArmorTypes,
    selectors.selectData,
    selectors.selectDifficulty,
    selectors.selectGrouping,
    selectors.selectLinks,
    selectors.selectLoading,
  ],
  (rows, armorTypes, data, difficulty, grouping, links, loading) => {
    const playerItems =
      grouping === Grouping.Player
        ? getPlayerListItems(rows, difficulty, links)
        : [];

    return {
      bossItems:
        grouping === Grouping.Boss
          ? getBossListItems(rows, armorTypes, data, difficulty, links)
          : [],
      grouping,
      playerSections: LIST_SLOT_ORDER.map((slot) => ({
        slot,
        items: playerItems.filter((item) => item.slot === slot),
      })).filter((section) => section.items.length),
      showEmpty: !rows.length && !loading,
    };
  },
);
