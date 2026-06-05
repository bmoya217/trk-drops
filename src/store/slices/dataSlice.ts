import type { PayloadAction } from "@reduxjs/toolkit";
import {
  ArmorType,
  ByDifficulty,
  Data,
  Difficulty,
  Grouping,
  Links,
  Reports_Difficulty,
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
  groups: string[];
  rows: Row[];
  headCells: string[];
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
  groups: BOSSES,
  rows: [],
  headCells: [],
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

const isEnumValue = <T extends Record<string, string>>(
  enumType: T,
  value: unknown
): value is T[keyof T] =>
  typeof value === "string" && Object.values(enumType).includes(value);

const getStringArray = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : undefined;

export const loadDataPreferences = (): Partial<PersistedDataPreferences> => {
  if (typeof window === "undefined") return {};

  try {
    const storedPreferences = window.localStorage.getItem(
      DATA_PREFERENCES_STORAGE_KEY
    );
    if (!storedPreferences) return {};

    const parsed = JSON.parse(storedPreferences);
    if (!parsed || typeof parsed !== "object") return {};

    return {
      ...(isEnumValue(Difficulty, parsed.difficulty)
        ? { difficulty: parsed.difficulty }
        : {}),
      ...(isEnumValue(Grouping, parsed.grouping)
        ? { grouping: parsed.grouping }
        : {}),
      ...(typeof parsed.group === "string" ? { group: parsed.group } : {}),
      ...(typeof parsed.column === "string"
        ? { column: parsed.column }
        : {}),
      ...(isEnumValue(View, parsed.view) ? { view: parsed.view } : {}),
      ...(getStringArray(parsed.armorTypes)
        ? {
            armorTypes: getStringArray(parsed.armorTypes).filter((armorType) =>
              isEnumValue(ArmorType, armorType)
            ),
          }
        : {}),
      ...(getStringArray(parsed.slots) ? { slots: parsed.slots } : {}),
    };
  } catch {
    return {};
  }
};

export const getDataPreferences = (
  state: DataSliceState
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
  preferences: Partial<PersistedDataPreferences> = {}
): DataSliceState => ({
  ...initialState,
  ...preferences,
});

export const persistDataPreferences = (state: DataSliceState) => {
  if (typeof window === "undefined") return;
  const preferences = JSON.stringify(getDataPreferences(state));

  window.localStorage.setItem(DATA_PREFERENCES_STORAGE_KEY, preferences);
  document.cookie = `${DATA_PREFERENCES_STORAGE_KEY}=${encodeURIComponent(
    preferences
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
  return Object.keys(
    state.data?.[state.difficulty]?.Player ?? {}
  ).sort();
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

const updateDerivedData = (state: DataSliceState) => {
  state.groups = getGroups(state);
  state.group = state.groups.includes(state.group)
    ? state.group
    : (state.groups[0] ?? "");
  state.rows = getRows(state);
  state.headCells = getHeadCells(state.rows, state.grouping);
  state.column = state.headCells.slice(1).includes(state.column)
    ? state.column
    : state.headCells[1];
};

export const dataSlice = createAppSlice({
  name: "data",
  initialState,
  reducers: (create) => ({
    hydratePreferences: create.reducer(
      (state, action: PayloadAction<Partial<PersistedDataPreferences>>) => {
        Object.assign(state, action.payload);
      }
    ),
    setDifficulty: create.reducer(
      (state, action: PayloadAction<Difficulty>) => {
        state.difficulty = action.payload;
        updateDerivedData(state);
      }
    ),
    setGrouping: create.reducer((state, action: PayloadAction<Grouping>) => {
      state.grouping = action.payload;
      updateDerivedData(state);
    }),
    setGroup: create.reducer((state, action: PayloadAction<string>) => {
      state.group = action.payload;
      updateDerivedData(state);
    }),
    setColumn: create.reducer((state, action: PayloadAction<string>) => {
      state.column = action.payload;
      updateDerivedData(state);
    }),
    setView: create.reducer((state, action: PayloadAction<View>) => {
      state.view = action.payload;
    }),
    toggleArmorType: create.reducer((state, action: PayloadAction<ArmorType>) => {
      state.armorTypes = state.armorTypes.includes(action.payload)
        ? state.armorTypes.filter((armorType) => armorType !== action.payload)
        : [...state.armorTypes, action.payload];
    }),
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

          const $ = await fetchReport(report);
          if (!validateReport($, d)) return;
          const result = formatResults($, d);
          return {
            ...result,
            d,
          };
        };

        const loadedReports = await Promise.all(
          Object.keys(reports).reduce(
            (diffs, d: Difficulty) => [
              ...diffs,
              ...reports[d].map((url) => loadReport(url, d)),
            ],
            []
          )
        );

        const filteredReports = loadedReports.filter(
          (report): report is { data: Data; links: Links; d: Difficulty } =>
            Boolean(report)
        );

        return filteredReports.reduce(
          (prev, curr) => {
            return {
              data: addData(prev.data, curr.data, curr.d),
              links: addLinks(prev.links, curr.links),
            };
          },
          { data: DIFFICULTY, links: {} }
        );
      },
      {
        pending: (state) => {
          state.loading = true;
          state.data = DIFFICULTY;
          state.rows = [];
          state.headCells = [];
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.links = action.payload.links;
          updateDerivedData(state);
        },
        rejected: (state) => {
          state.loading = false;
        },
      }
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
    selectGroups: (data) => data.groups,
    selectRows: (data) => data.rows,
    selectHeadCells: (data) => data.headCells,
  },
});
