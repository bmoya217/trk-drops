import { Divider, LinearProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ByDifficulty,
  ByTeam,
  Data,
  Difficulty,
  Grouping,
  Links,
  Team,
} from "../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  validateReport,
} from "../../public/utils";
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

      setLoading(false);
    };

    loadReports();

    return () => {
      controller.abort();
    };
  }, [loading]);

  return (
    <Paper
      sx={{
        margin: "12px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <Toolbar
        data={data[team]}
        team={team}
        setTeam={setTeam}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        grouping={grouping}
        setGrouping={setGrouping}
        group={group}
        setGroup={setGroup}
        refetch={() => setLoading(true)}
      />

      {loading ? <LinearProgress /> : <Divider />}

      <Table
        difficulty={difficulty}
        grouping={grouping}
        group={group}
        data={data[team]}
        links={links}
        loading={loading}
      />
    </Paper>
  );
};

export default Drops;
