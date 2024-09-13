import { Box, LinearProgress, Paper } from "@mui/material";
import { useContext } from "react";
import { View } from "../../../public/types";
import { DataContext } from "../context/DataContext";
import Chart from "./Chart";
import Table from "./Table";
import Toolbar from "./Toolbar";

const Drops = () => {
  const { view, loading } = useContext(DataContext);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        margin: "12px",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Toolbar />

      {loading && <LinearProgress />}

      <Paper
        sx={{
          display: "flex",
          flex: 1,
          padding: "8px",
          overflow: "scroll",
        }}
      >
        {view === View.Table ? <Table /> : <Chart />}
      </Paper>
    </Box>
  );
};

export default Drops;
