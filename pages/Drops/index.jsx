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
        return {
          ...prev,
          [curr]: [
            ...(data?.Boss?.[curr] ?? []),
            ...(newData?.Boss?.[curr] ?? []),
          ],
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
      if (!reports?.length) return setLoading(false);
      setReports(reports);
    };

    loadReports();
  }, [team, difficulty]);

  useEffect(() => {
    Promise.all(reports.map(loadReport))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
