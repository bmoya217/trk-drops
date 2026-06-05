import { Box, Divider, LinearProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import { View } from "../../public/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { dataSlice } from "../store/slices/dataSlice";
import Chart from "./Chart";
import Header from "./Header";
import List from "./List";
import Table from "./Table";
import Toolbar from "./Toolbar";

const Drops = () => {
  const view = useAppSelector(dataSlice.selectors.selectView);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dataSlice.actions.fetchReports());
  }, [dispatch]);

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
          overflow: "auto",
        }}
      >
        {view === View.Table ? (
          <Table />
        ) : view === View.Chart ? (
          <Chart />
        ) : (
          <List />
        )}
      </Paper>
    </Box>
  );
};

export default Drops;
