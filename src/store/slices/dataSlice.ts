import type { PayloadAction } from "@reduxjs/toolkit";
import {
  ByDifficulty,
  ByTeam,
  Data,
  Difficulty,
  Grouping,
  Links,
  Row,
  Team,
  View,
} from "../../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  getHeadCells,
  validateReport,
} from "../../../public/utils";
import { createAppSlice } from "../createAppSlice";

const DIFFICULTY: ByDifficulty = {
  Heroic: { Boss: {}, Player: {} },
  Mythic: { Boss: {}, Player: {} },
  Dungeon: { Boss: {}, Player: {} },
};

const DATA: ByTeam = {
  Royal: DIFFICULTY,
  Kingdom: DIFFICULTY,
};

export interface DataSliceState {
  team: Team;
  difficulty: Difficulty;
  grouping: Grouping;
  group: string;
  column: string;
  view: View;
  data: ByTeam;
  links: Links;
  loading: boolean;
  groups: string[];
  rows: Row[];
  headCells: string[];
}

const initialState: DataSliceState = {
  team: Team.Royal,
  difficulty: Difficulty.Mythic,
  grouping: Grouping.Boss,
  group: BOSSES[0],
  column: undefined,
  view: View.Table,
  data: DATA,
  links: {},
  loading: true,
  groups: [],
  rows: [],
  headCells: [],
};

const addData = (data: ByTeam, newData: Data, t: Team, d: Difficulty) => {
  const Boss = BOSSES.reduce((prev, curr) => {
    const oldRows = data?.[t]?.[d]?.Boss?.[curr] ?? [];
    const newRows = newData?.Boss?.[curr] ?? [];

    return {
      ...prev,
      [curr]: [...oldRows, ...newRows],
    };
  }, {});

  const Player = {
    ...data[t][d].Player,
    ...newData.Player,
  };

  return {
    ...data,
    [t]: {
      ...data[t],
      [d]: { Boss, Player },
    },
  };
};

const addLinks = (links: Links, newLinks: Links) => {
  return {
    ...links,
    ...newLinks,
  };
};

const getGroup = (state: DataSliceState): string => {
  const groups = state.data?.[state.team]?.[state.difficulty]?.[state.grouping];
  if (!groups) return "";
  const groupKeys = Object.keys(groups);
  return groupKeys.includes(state.group) ? state.group : groupKeys[0];
};

const getColumn = (state: DataSliceState): string => {
  const groups = state.data?.[state.team]?.[state.difficulty]?.[state.grouping];
  const rows = groups?.[state.group];
  const headCells = getHeadCells(rows, state.grouping);
  return headCells.slice(1).includes(state.column)
    ? state.column
    : headCells[1];
};

export const dataSlice = createAppSlice({
  name: "data",
  initialState,
  reducers: (create) => ({
    setTeam: create.reducer((state, action: PayloadAction<Team>) => {
      state.team = action.payload;
      state.group = getGroup(state);
      state.column = getColumn(state);
    }),
    setDifficulty: create.reducer(
      (state, action: PayloadAction<Difficulty>) => {
        state.difficulty = action.payload;
        state.group = getGroup(state);
        state.column = getColumn(state);
      }
    ),
    setGrouping: create.reducer((state, action: PayloadAction<Grouping>) => {
      state.grouping = action.payload;
      state.group = getGroup(state);
      state.column = getColumn(state);
    }),
    setGroup: create.reducer((state, action: PayloadAction<string>) => {
      state.group = action.payload;
      state.group = getGroup(state);
      state.column = getColumn(state);
    }),
    setColumn: create.reducer((state, action: PayloadAction<string>) => {
      state.column = action.payload;
      state.group = getGroup(state);
      state.column = getColumn(state);
    }),
    setView: create.reducer((state, action: PayloadAction<View>) => {
      state.view = action.payload;
    }),

    // thunks
    fetchReports: create.asyncThunk(
      async (): Promise<{ data: ByTeam; links: Links }> => {
        const reports = await fetchReports();

        const loadReport = async (report: string, t: Team, d: Difficulty) => {
          if (!report || report.length < 10) return;

          const $ = await fetchReport(report);
          if (!validateReport($, d)) return;
          const result = formatResults($, d);
          return {
            ...result,
            t,
            d,
          };
        };

        const loadedReports = await Promise.all(
          Object.keys(reports).reduce(
            (teams, t: Team) => [
              ...teams,
              ...Object.keys(reports[t]).reduce(
                (diffs, d: Difficulty) => [
                  ...diffs,
                  ...reports[t][d].map((url) => loadReport(url, t, d)),
                ],
                []
              ),
            ],
            []
          )
        );

        const filteredReports = loadedReports.filter((report) => report);

        return filteredReports.reduce(
          (prev, curr) => {
            return {
              data: addData(prev.data, curr.data, curr.t, curr.d),
              links: addLinks(prev.links, curr.links),
            };
          },
          { data: DATA, links: [] }
        );
      },
      {
        pending: (state) => {
          state.loading = true;
          state.data = DATA;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.links = action.payload.links;
          state.group = getGroup(state);
          state.column = getColumn(state);
        },
        rejected: (state) => {
          state.loading = false;
        },
      }
    ),
  }),
  selectors: {
    selectTeam: (data) => data.team,
    selectDifficulty: (data) => data.difficulty,
    selectGrouping: (data) => data.grouping,
    selectGroup: (data) => data.group,
    selectColumn: (data) => data.column,
    selectView: (data) => data.view,
    selectData: (data) => data.data[data.team],
    selectLinks: (data) => data.links,
    selectLoading: (data) => data.loading,
    selectGroups: (data) => {
      if (data.grouping === Grouping.Boss) return BOSSES;
      return Object.keys(
        data.data?.[data.team]?.[data.difficulty]?.Player ?? {}
      ).sort();
    },
    selectRows: (data) => {
      const difficultyRows =
        data.data?.[data.team]?.[data.difficulty]?.[data.grouping]?.[
          data.group
        ] ?? [];
      const playerRows =
        data.grouping === Grouping.Player
          ? (data.data?.[data.team]?.Dungeon?.Player?.[data.group] ?? [])
          : [];
      return [...difficultyRows, ...playerRows];
    },
    selectHeadCells: (data) => {
      const difficultyRows =
        data.data?.[data.team]?.[data.difficulty]?.[data.grouping]?.[
          data.group
        ] ?? [];
      const playerRows =
        data.grouping === Grouping.Player
          ? (data.data?.[data.team]?.Dungeon?.Player?.[data.group] ?? [])
          : [];
      const rows = [...difficultyRows, ...playerRows];
      return getHeadCells(rows, data.grouping);
    },
  },
});
