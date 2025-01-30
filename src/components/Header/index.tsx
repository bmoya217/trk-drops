import { Box } from "@mui/material";
import { FC, useContext } from "react";
import { Grouping, Screen, View } from "../../../public/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ScreenContext } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import Select from "./Select";

const Header: FC = () => {
  const { size } = useContext(ScreenContext);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const groups = useAppSelector(dataSlice.selectors.selectGroups);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const dispatch = useAppDispatch();

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
          onChange={(group: string) =>
            dispatch(dataSlice.actions.setGroup(group))
          }
        />
      ) : null}

      {/* select column */}
      {showColum ? (
        <Select
          label={grouping === Grouping.Boss ? "Item" : "Slot"}
          value={column}
          values={headCells.slice(1)}
          onChange={(column: string) =>
            dispatch(dataSlice.actions.setColumn(column))
          }
        />
      ) : null}
    </Box>
  );
};

export default Header;
