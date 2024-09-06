import { Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Data, Difficulty, Grouping, Team } from "../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  validateReport,
} from "../../public/utils";
import EnhancedTable from "./Table";
import EnhancedToolbar from "./Toolbar";

const Drops = () => {
  const [team, setTeam] = useState(Team.Royal);
  const [difficulty, setDifficulty] = useState(Difficulty.Mythic);
  const [grouping, setGrouping] = useState(Grouping.Boss);
  const [group, setGroup] = useState(BOSSES[0]);
  const [reports, setReports] = useState<string[]>([]);
  const [data, setData] = useState<Data>({ Boss: {}, Player: {} });
  const [loading, setLoading] = useState(true);

  const addData = (newData: Data) => {
    setData((data) => {
      const Boss = BOSSES.reduce((prev, curr) => {
        const oldRows = data?.Boss?.[curr] ?? [];
        const newRows = newData?.Boss?.[curr] ?? [];
        const filteredRows = oldRows.filter(
          (oldRow) => !newRows.find((newRow) => newRow.Player === oldRow.Player)
        );

        return {
          ...prev,
          [curr]: [...filteredRows, ...newRows],
        };
      }, {});

      const Player = {
        ...data.Player,
        ...newData.Player,
      };

      return { Boss, Player };
    });
  };

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setData({ Boss: {}, Player: {} });
      const reports = await fetchReports(team, difficulty);
      setReports(reports);
    };

    loadReports();
  }, [team, difficulty]);

  useEffect(() => {
    if (!reports.length) return;

    const loadData = async () => {
      const loadReport = async (url: string) => {
        const $ = await fetchReport(url);

        if (!validateReport($, difficulty)) return;

        addData(formatResults($));
      };

      await Promise.all(reports.map(loadReport)).catch(() => {});
      setLoading(false);
    };

    loadData();
  }, [reports, difficulty]);

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
      <EnhancedToolbar
        team={team}
        setTeam={setTeam}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        grouping={grouping}
        setGrouping={setGrouping}
        group={group}
        setGroup={setGroup}
        data={data}
      />

      <Divider />

      <EnhancedTable
        grouping={grouping}
        group={group}
        data={data}
        loading={loading}
      />
    </Paper>
  );
};

export default Drops;
