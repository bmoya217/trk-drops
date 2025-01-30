import { Box, Divider, LinearProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import { View } from "../../public/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { dataSlice } from "../store/slices/dataSlice";
import Chart from "./Chart";
import Header from "./Header";
import Table from "./Table";
import Toolbar from "./Toolbar";

const Drops = () => {
  const view = useAppSelector(dataSlice.selectors.selectView);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dataSlice.actions.fetchReports());
  }, []);

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

      {loading ? <LinearProgress /> : <Divider />}

      <Header />

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
