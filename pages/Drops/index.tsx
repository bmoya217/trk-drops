import { Box, LinearProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ByDifficulty,
  ByTeam,
  Data,
  Difficulty,
  Grouping,
  Links,
  Team,
  View,
} from "../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  getHeadCells,
  validateReport,
} from "../../public/utils";
import Chart from "./Chart";
import Table from "./Table";
import Toolbar from "./Toolbar";

const DIFFICULTY: ByDifficulty = {
  Heroic: { Boss: {}, Player: {} },
  Mythic: { Boss: {}, Player: {} },
  Dungeon: { Boss: {}, Player: {} },
};

const DATA: ByTeam = {
  Royal: DIFFICULTY,
  Kingdom: DIFFICULTY,
};

const Drops = () => {
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
        if (!report) return;

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

  return (
    <Box
      sx={{
        margin: "12px",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Toolbar
        team={team}
        setTeam={setTeam}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        grouping={grouping}
        setGrouping={setGrouping}
        group={group}
        setGroup={setGroup}
        column={column}
        setColumn={setColumn}
        view={view}
        setView={setView}
        data={data[team]}
        headCells={headCells}
        refetch={() => setLoading(true)}
      />

      {loading && <LinearProgress />}

      <Paper
        sx={{
          padding: "8px",
          display: "flex",
          flex: 1,
          overflow: "scroll",
        }}
      >
        {view === View.Table ? (
          <Table
            difficulty={difficulty}
            column={column}
            headCells={headCells}
            rows={rows}
            links={links}
            loading={loading}
          />
        ) : (
          <Chart
            difficulty={difficulty}
            column={column}
            rows={rows}
            links={links}
            loading={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Drops;
