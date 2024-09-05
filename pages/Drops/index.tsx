import { useEffect, useState } from "react";
import { Data, Difficulty, Grouping, Team } from "../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  validateReport,
} from "../../public/utils";
import Table from "./Table";

const Drops = () => {
  const [team, setTeam] = useState(Team.Royal);
  const [difficulty, setDifficulty] = useState(Difficulty.Mythic);
  const [grouping, setGrouping] = useState(Grouping.Boss);
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

  const loadReport = async (url: string) => {
    const $ = await fetchReport(url);

    if (!validateReport($, difficulty)) return;

    addData(formatResults($));
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
      await Promise.all(reports.map(loadReport)).catch(() => {});
      setLoading(false);
    };

    loadData();
  }, [reports]);

  return (
    <Table
      team={team}
      setTeam={setTeam}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      grouping={grouping}
      setGrouping={setGrouping}
      data={data}
      loading={loading}
    />
  );
};

export default Drops;
