import React, { useState } from "react";
import Table from "./Table";

const Drops = () => {
  const [rows, setRows] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table rows={rows} setRows={setRows} />
    </div>
  );
};

export default Drops;
