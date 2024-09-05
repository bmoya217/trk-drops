import React, { useEffect, useState } from "react";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  validateReport,
} from "../../public/utils";
import Table from "./Table";

const Drops = () => {
  const [team, setTeam] = useState("Royal"); // or Kingdom
  const [difficulty, setDifficulty] = useState("Mythic"); // or Heroic
  const [grouping, setGrouping] = useState("Boss"); // or Player
  const [reports, setReports] = useState([]); // list of urls
  const [data, setData] = useState({ Boss: {}, Player: {} });
  const [loading, setLoading] = useState(true);

  const addData = (newData) => {
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

  const loadReport = async (url) => {
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table
        team={team}
        setTeam={setTeam}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        grouping={grouping}
        setGrouping={setGrouping}
        data={data}
        setData={setData}
        loading={loading}
      />
    </div>
  );
};

export default Drops;
