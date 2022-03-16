import { AddLink } from "@mui/icons-material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const Item = ({ loadReport }) => {
  const [report, setReport] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "inline-flex", flex: 1 }}>
        <TextField
          value={report}
          onChange={(e) => setReport(e.target.value)}
          background={"grey"}
          size="small"
          style={{ width: "300px" }}
        />
        <button onClick={() => loadReport(report)}>
          <AddLink />
        </button>
      </div>
    </div>
  );
};

export default Item;
