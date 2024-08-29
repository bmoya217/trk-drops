import React, { useEffect, useState } from "react";
import {
  EMPTY_ROW,
  fetchReport,
  fetchReports,
  formatResults,
  selectId,
  selectPlayer,
  validateReport,
} from "../../public/utils";
import Table from "./Table";

const Drops = () => {
  const [reports, setReports] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("Mythic");
  const [team, setTeam] = useState("Royal");

  const addRow = (row) => {
    return setRows((rows) => [
      ...rows.filter((r) => r.Player !== row.Player),
      row,
    ]);
  };

  const loadReport = async (report) => {
    const $ = await fetchReport(report);

    if (!validateReport($, difficulty)) return;

    addRow({
      ...EMPTY_ROW,
      id: selectId($),
      Player: selectPlayer($),
      ...formatResults($),
    });
  };

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setRows([]);
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
        rows={rows}
        setRows={setRows}
        loading={loading}
      />
    </div>
  );
};

export default Drops;
