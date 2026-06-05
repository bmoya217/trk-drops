import {
  BarChart,
  ExpandMore,
  FilterList,
  TableView,
  Toc,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { FC, useState } from "react";
import { Difficulty, Grouping, View, type ByDifficulty } from "../../lib/types";
import { BOSSES } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useScreen } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";

const getDefaultGroup = ({
  data,
  difficulty,
  grouping,
}: {
  data: ByDifficulty;
  difficulty: Difficulty;
  grouping: Grouping;
}) => {
  if (grouping === Grouping.Boss) return BOSSES[0];

  const players = Object.keys(data[difficulty].Player);

  return players.length ? players[0] : "";
};

const Breadcrumbs: FC = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { shouldCollapseFilters: collapseFilters } = useScreen();
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const data = useAppSelector(dataSlice.selectors.selectData);
  const dispatch = useAppDispatch();

  const controlSx = {
    "& .MuiToggleButton-root": {
      border: 0,
      borderRadius: 1,
      color: "text.secondary",
      px: 1.25,
      py: 0.5,
      textTransform: "none",
      whiteSpace: "nowrap",
    },
    "& .MuiToggleButton-root.Mui-selected": {
      bgcolor: "background.paper",
      boxShadow: 1,
      color: "text.primary",
      "&:hover": {
        bgcolor: "background.paper",
      },
    },
    bgcolor: "action.hover",
    borderRadius: 1,
    p: 0.25,
  };

  const controls = (
    <Stack
      direction={collapseFilters ? "column" : "row"}
      spacing={collapseFilters ? 0.75 : 1}
      sx={{ flexWrap: collapseFilters ? "nowrap" : "wrap", minWidth: 0 }}
    >
      <ToggleButtonGroup
        exclusive
        onChange={(_, value: Difficulty | null) => {
          if (value) dispatch(dataSlice.actions.setDifficulty(value));
        }}
        size="small"
        sx={controlSx}
        value={difficulty}
      >
        <ToggleButton value={Difficulty.Mythic}>Mythic</ToggleButton>
        <ToggleButton value={Difficulty.Heroic}>Heroic</ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        exclusive
        onChange={(_, value: Grouping | null) => {
          if (!value) return;

          dispatch(dataSlice.actions.setGrouping(value));
          dispatch(
            dataSlice.actions.setGroup(
              getDefaultGroup({ data, difficulty, grouping: value }),
            ),
          );
        }}
        size="small"
        sx={controlSx}
        value={grouping}
      >
        <ToggleButton value={Grouping.Boss}>
          <TableView fontSize="small" sx={{ mr: 0.75 }} />
          Boss
        </ToggleButton>
        <ToggleButton value={Grouping.Player}>Player</ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        exclusive
        onChange={(_, value: View | null) => {
          if (value) dispatch(dataSlice.actions.setView(value));
        }}
        size="small"
        sx={controlSx}
        value={view}
      >
        <ToggleButton value={View.Table}>
          <Toc fontSize="small" sx={{ mr: 0.75, transform: "scale(-1, -1)" }} />
          Table
        </ToggleButton>
        <ToggleButton value={View.List}>List</ToggleButton>
        <ToggleButton value={View.Chart}>
          <BarChart fontSize="small" sx={{ mr: 0.75 }} />
          Chart
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  if (!collapseFilters) return controls;

  return (
    <ClickAwayListener onClickAway={() => setFiltersOpen(false)}>
      <Box sx={{ minWidth: 0, position: "relative" }}>
        <Button
          aria-controls={filtersOpen ? "dataset-filter-panel" : undefined}
          aria-expanded={filtersOpen ? "true" : undefined}
          aria-haspopup="true"
          endIcon={<ExpandMore fontSize="small" />}
          onClick={() => setFiltersOpen((open) => !open)}
          size="small"
          startIcon={<FilterList fontSize="small" />}
          variant="outlined"
          sx={{
            borderColor: "divider",
            color: "text.primary",
            minHeight: 40,
            textTransform: "none",
            "&:hover": {
              bgcolor: "action.hover",
              borderColor: "text.secondary",
            },
          }}
        >
          Data filters
        </Button>

        {filtersOpen ? (
          <Paper
            elevation={6}
            id="dataset-filter-panel"
            sx={{
              left: 0,
              mt: 1,
              p: 1,
              position: "absolute",
              top: "100%",
              zIndex: (theme) => theme.zIndex.appBar,
            }}
          >
            {controls}
          </Paper>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

export default Breadcrumbs;
