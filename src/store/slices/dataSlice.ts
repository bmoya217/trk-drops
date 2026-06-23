import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import {
  ArmorType,
  ByDifficulty,
  Data,
  Difficulty,
  Grouping,
  Links,
  Row,
  View,
} from "../../lib/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  getHeadCells,
  validateReport,
} from "../../lib/utils";
import { createAppSlice } from "../createAppSlice";

const DIFFICULTY: ByDifficulty = {
  Heroic: { Boss: {}, Player: {} },
  Mythic: { Boss: {}, Player: {} },
  Dungeon: { Boss: {}, Player: {} },
};
export const DATA_PREFERENCES_STORAGE_KEY = "drops-data-preferences";
const PERSISTED_DATA_PREFERENCES_MAX_AGE = 60 * 60 * 24 * 365;

export interface DataSliceState {
  difficulty: Difficulty;
  grouping: Grouping;
  group: string;
  column: string;
  view: View;
  armorTypes: ArmorType[];
  slots: string[];
  data: ByDifficulty;
  links: Links;
  loading: boolean;
}

const initialState: DataSliceState = {
  difficulty: Difficulty.Mythic,
  grouping: Grouping.Boss,
  group: BOSSES[0],
  column: undefined,
  view: View.Table,
  armorTypes: [],
  slots: [],
  data: DIFFICULTY,
  links: {},
  loading: true,
};

type PersistedDataPreferences = Pick<
  DataSliceState,
  | "armorTypes"
  | "column"
  | "difficulty"
  | "group"
  | "grouping"
  | "slots"
  | "view"
>;

export const getDataPreferences = (
  state: DataSliceState,
): PersistedDataPreferences => ({
  armorTypes: state.armorTypes,
  column: state.column,
  difficulty: state.difficulty,
  group: state.group,
  grouping: state.grouping,
  slots: state.slots,
  view: state.view,
});

export const createInitialDataState = (
  preferences: Partial<PersistedDataPreferences> = {},
): DataSliceState => ({
  ...initialState,
  ...preferences,
});

export const persistDataPreferences = (state: DataSliceState) => {
  if (typeof window === "undefined") return;
  const preferences = JSON.stringify(getDataPreferences(state));

  window.localStorage.setItem(DATA_PREFERENCES_STORAGE_KEY, preferences);
  document.cookie = `${DATA_PREFERENCES_STORAGE_KEY}=${encodeURIComponent(
    preferences,
  )}; max-age=${PERSISTED_DATA_PREFERENCES_MAX_AGE}; path=/; samesite=lax`;
};

const addData = (data: ByDifficulty, newData: Data, d: Difficulty) => {
  const Boss = BOSSES.reduce((prev, curr) => {
    const oldRows = data?.[d]?.Boss?.[curr] ?? [];
    const newRows = newData?.Boss?.[curr] ?? [];

    return {
      ...prev,
      [curr]: [...oldRows, ...newRows],
    };
  }, {});

  const Player = {
    ...data[d].Player,
    ...newData.Player,
  };

  return {
    ...data,
    [d]: { Boss, Player },
  };
};

const addLinks = (links: Links, newLinks: Links) => {
  return {
    ...links,
    ...newLinks,
  };
};

const getGroups = (state: DataSliceState): string[] => {
  if (state.grouping === Grouping.Boss) return BOSSES;
  return Object.keys(state.data?.[state.difficulty]?.Player ?? {}).sort();
};

const getRows = (state: DataSliceState): Row[] => {
  const difficultyRows =
    state.data?.[state.difficulty]?.[state.grouping]?.[state.group] ?? [];
  const playerRows =
    state.grouping === Grouping.Player
      ? (state.data?.Dungeon?.Player?.[state.group] ?? [])
      : [];

  return [...difficultyRows, ...playerRows];
};

const normalizeSelection = (state: DataSliceState) => {
  const groups = getGroups(state);
  state.group = groups.includes(state.group) ? state.group : (groups[0] ?? "");
  const headCells = getHeadCells(getRows(state), state.grouping);
  state.column = headCells.slice(1).includes(state.column)
    ? state.column
    : headCells[1];
};

const selectGroups = createSelector(
  [
    (data: DataSliceState) => data.grouping,
    (data: DataSliceState) => data.difficulty,
    (data: DataSliceState) => data.data,
  ],
  (grouping, difficulty, data) =>
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.[difficulty]?.Player ?? {}).sort(),
);

const selectRows = createSelector(
  [
    (data: DataSliceState) => data.difficulty,
    (data: DataSliceState) => data.grouping,
    (data: DataSliceState) => data.group,
    (data: DataSliceState) => data.data,
  ],
  (difficulty, grouping, group, data) => {
    const difficultyRows = data?.[difficulty]?.[grouping]?.[group] ?? [];
    const dungeonRows =
      grouping === Grouping.Player
        ? (data?.Dungeon?.Player?.[group] ?? [])
        : [];

    return [...difficultyRows, ...dungeonRows];
  },
);

const selectHeadCells = createSelector(
  [selectRows, (data: DataSliceState) => data.grouping],
  getHeadCells,
);

export const dataSlice = createAppSlice({
  name: "data",
  initialState,
  reducers: (create) => ({
    setDifficulty: create.reducer(
      (state, action: PayloadAction<Difficulty>) => {
        state.difficulty = action.payload;
        normalizeSelection(state);
      },
    ),
    setGrouping: create.reducer((state, action: PayloadAction<Grouping>) => {
      state.grouping = action.payload;
      normalizeSelection(state);
    }),
    setGroup: create.reducer((state, action: PayloadAction<string>) => {
      state.group = action.payload;
      normalizeSelection(state);
    }),
    setColumn: create.reducer((state, action: PayloadAction<string>) => {
      state.column = action.payload;
      normalizeSelection(state);
    }),
    setView: create.reducer((state, action: PayloadAction<View>) => {
      state.view = action.payload;
    }),
    toggleArmorType: create.reducer(
      (state, action: PayloadAction<ArmorType>) => {
        state.armorTypes = state.armorTypes.includes(action.payload)
          ? state.armorTypes.filter((armorType) => armorType !== action.payload)
          : [...state.armorTypes, action.payload];
      },
    ),
    toggleSlot: create.reducer((state, action: PayloadAction<string>) => {
      state.slots = state.slots.includes(action.payload)
        ? state.slots.filter((slot) => slot !== action.payload)
        : [...state.slots, action.payload];
    }),

    // thunks
    fetchReports: create.asyncThunk(
      async (): Promise<{ data: ByDifficulty; links: Links }> => {
        const reports = await fetchReports();
        if (!reports) return { data: DIFFICULTY, links: {} };

        const loadReport = async (report: string, d: Difficulty) => {
          if (!report || report.length < 10) return;

          try {
            const $ = await fetchReport(report);
            if (!validateReport($, d)) return;
            const result = formatResults($, d);
            return {
              ...result,
              d,
            };
          } catch {
            return;
          }
        };

        const loadedReports = await Promise.all(
          Object.keys(reports).reduce(
            (diffs, d: Difficulty) => [
              ...diffs,
              ...reports[d].map((url) => loadReport(url, d)),
            ],
            [],
          ),
        );

        const filteredReports = loadedReports.filter(Boolean);

        return filteredReports.reduce(
          (prev, curr) => {
            return {
              data: addData(prev.data, curr.data, curr.d),
              links: addLinks(prev.links, curr.links),
            };
          },
          { data: DIFFICULTY, links: {} },
        );
      },
      {
        pending: (state) => {
          state.loading = true;
          state.data = DIFFICULTY;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.links = action.payload.links;
          normalizeSelection(state);
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
  selectors: {
    selectDifficulty: (data) => data.difficulty,
    selectGrouping: (data) => data.grouping,
    selectGroup: (data) => data.group,
    selectColumn: (data) => data.column,
    selectView: (data) => data.view,
    selectArmorTypes: (data) => data.armorTypes,
    selectSlots: (data) => data.slots,
    selectData: (data) => data.data,
    selectLinks: (data) => data.links,
    selectLoading: (data) => data.loading,
    selectGroups,
    selectRows,
    selectHeadCells,
  },
});
