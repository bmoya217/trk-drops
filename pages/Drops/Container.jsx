import React, { useState } from "react";
import Table from "./Table";

const Container = () => {
  const [rows, setRows] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table rows={rows} setRows={setRows} />
    </div>
  );
};

export default Container;
