import { Box } from "@mui/material";
import { FC, useContext } from "react";
import { Grouping, Screen, View } from "../../../../public/types";
import { DataContext } from "../../context/DataContext";
import { ScreenContext } from "../../context/ScreenContext";
import Select from "./Select";

const Header: FC = () => {
  const { size } = useContext(ScreenContext);
  const {
    grouping,
    group,
    setGroup,
    column,
    setColumn,
    view,
    groups,
    headCells,
  } = useContext(DataContext);

  const showGroup = group && groups.length;
  const showColum =
    (view === View.Chart || size === Screen.Small) &&
    showGroup &&
    headCells.length > 1;

  return (
    <Box>
      {/* select group */}
      {showGroup ? (
        <Select
          label={grouping}
          value={group}
          values={groups}
          onChange={setGroup}
        />
      ) : null}

      {/* select column */}
      {showColum ? (
        <Select
          label={grouping === Grouping.Boss ? "Item" : "Slot"}
          value={column}
          values={headCells.slice(1)}
          onChange={setColumn}
        />
      ) : null}
    </Box>
  );
};

export default Header;
