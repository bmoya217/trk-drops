import React, { useEffect, useState } from "react";
import {
  EMPTY_ROW,
  fetchReport,
  fetchReports,
  formatResults,
  selectId,
  selectPlayer,
} from "../../public/utils";
import Table from "./Table";

const Drops = () => {
  const [reports, setReports] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const addRow = (row) => {
    return setRows((rows) => [
      ...rows.filter((r) => r.Player !== row.Player),
      row,
    ]);
  };

  const loadReports = async () => {
    setLoading(true);
    const reports = await fetchReports();
    if (!reports?.length) return setLoading(false);
    setReports(reports);
  };

  const loadReport = async (report) => {
    const $ = await fetchReport(report);
    console.log($);
    addRow({
      ...EMPTY_ROW,
      id: selectId($),
      Player: selectPlayer($),
      ...formatResults($),
    });
  };

  useEffect(() => loadReports(), []);

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
      <Table loading={loading} rows={rows} setRows={setRows} />
    </div>
  );
};

export default Drops;
