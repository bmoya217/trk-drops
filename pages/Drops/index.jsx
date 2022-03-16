import React, { useState } from "react";
import {
  EMPTY_ROW,
  fetchReport,
  formatResults,
  selectId,
  selectPlayer,
} from "../../public/utils";
import Table from "./Table";

const Drops = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const addRow = (row) => {
    return setRows((rows) => [
      ...rows.filter((r) => r.Player !== row.Player),
      row,
    ]);
  };

  const loadReport = async (report) => {
    setLoading(true);
    const reports = await fetchReport(report);
    if (!reports?.length) return setLoading(false);

    reports.map(($) => {
      addRow({
        ...EMPTY_ROW,
        id: selectId($),
        Player: selectPlayer($),
        ...formatResults($),
      });
    });
    setLoading(false);
  };

  React.useEffect(() => loadReport("*"), []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table
        loading={loading}
        rows={rows}
        setRows={setRows}
        loadReport={loadReport}
      />
    </div>
  );
};

export default Drops;
