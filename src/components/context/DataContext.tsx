import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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

const DIFFICULTY: ByDifficulty = {
  Heroic: { Boss: {}, Player: {} },
  Mythic: { Boss: {}, Player: {} },
  Dungeon: { Boss: {}, Player: {} },
};

const DATA: ByTeam = {
  Royal: DIFFICULTY,
  Kingdom: DIFFICULTY,
};

interface Context {
  team: Team;
  setTeam: Dispatch<SetStateAction<Team>>;
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  grouping: Grouping;
  setGrouping: Dispatch<SetStateAction<Grouping>>;
  group: string;
  setGroup: Dispatch<SetStateAction<string>>;
  column: string;
  setColumn: Dispatch<SetStateAction<string>>;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  data: ByDifficulty;
  links: Links;
  loading: boolean;
  groups: string[];
  rows: Row[];
  headCells: string[];
}

export const DataContext = createContext<Context>({
  team: Team.Royal,
  setTeam: (_: Team) => {},
  difficulty: Difficulty.Mythic,
  setDifficulty: (_: Difficulty) => {},
  grouping: Grouping.Boss,
  setGrouping: (_: Grouping) => {},
  group: BOSSES[0],
  setGroup: (_: string) => {},
  column: undefined,
  setColumn: (_: Team) => {},
  view: View.Table,
  setView: (_: View) => {},
  data: DIFFICULTY,
  links: {},
  loading: true,
  groups: [],
  rows: [],
  headCells: [],
});

const DataProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [team, setTeam] = useState(Team.Royal);
  const [difficulty, setDifficulty] = useState(Difficulty.Mythic);
  const [grouping, setGrouping] = useState(Grouping.Boss);
  const [group, setGroup] = useState(BOSSES[0]);
  const [column, setColumn] = useState<string | undefined>();
  const [view, setView] = useState<View>(View.Table);
  const [data, setData] = useState<ByTeam>(DATA);
  const [links, setLinks] = useState<Links>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;

    const controller = new AbortController();

    const addData = (newData: Data, t: Team, d: Difficulty) => {
      setData((data) => {
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
      });
    };

    const addLinks = (newLinks: Links) => {
      setLinks((links) => {
        return {
          ...links,
          ...newLinks,
        };
      });
    };

    const loadReports = async () => {
      setData(DATA);

      const reports = await fetchReports(controller);
      if (!reports) return;

      const loadReport = async (report: string, t: Team, d: Difficulty) => {
        if (!report || report.length < 10) return;

        const $ = await fetchReport(report, controller);
        if (!validateReport($, d)) return;
        const [data, links] = formatResults($, d);
        addData(data, t, d);
        addLinks(links);
      };

      const promises = Object.keys(reports).reduce(
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
      );

      await Promise.all(promises).catch((e) => console.log(e));

      if (!controller.signal.aborted) setLoading(false);
    };

    loadReports();

    return () => {
      controller.abort();
    };
  }, [loading]);

  useEffect(() => {
    const groups = data?.[team]?.[difficulty]?.[grouping];
    const groupKeys = Object.keys(groups);
    const g = groupKeys.includes(group) ? group : groupKeys[0];
    setGroup(g);

    const rows = groups?.[g];
    const headCells = getHeadCells(rows, grouping);
    const c = headCells.slice(1).includes(column) ? column : headCells[1];
    setColumn(c);
  }, [team, difficulty, grouping, group, column, data]);

  const difficultyRows = data?.[team]?.[difficulty]?.[grouping]?.[group] ?? [];
  const playerRows =
    grouping === Grouping.Player
      ? (data?.[team]?.Dungeon?.Player?.[group] ?? [])
      : [];
  const rows = [...difficultyRows, ...playerRows];
  const headCells = getHeadCells(rows, grouping);
  const groups =
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.[team]?.[difficulty]?.Player ?? {}).sort();

  return (
    <DataContext.Provider
      value={{
        team,
        setTeam,
        difficulty,
        setDifficulty,
        grouping,
        setGrouping,
        group,
        setGroup,
        column,
        setColumn,
        view,
        setView,
        data: data[team],
        links,
        loading,
        groups,
        rows,
        headCells,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
