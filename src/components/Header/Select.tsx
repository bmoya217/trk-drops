import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import { FC, useRef } from "react";
import { useScreen } from "../../store/ScreenContext";
import { getMenuMaxHeight, menuPositionProps } from "./menu";

export enum Open {
  Difficulty = "Difficulty",
  Grouping = "Grouping",
  Group = "Group",
  Column = "Column",
  Closed = "Closed",
}

interface Props<T> {
  label: string;
  value: T;
  values: T[];
  onChange?: (value: T) => void;
}

const Select: FC<Props<string>> = ({ label, value, values, onChange }) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const { height } = useScreen();
  const minWidth = label === "Item" ? 208 : 144;
  const menuMaxHeight = getMenuMaxHeight(anchorRef.current, height);

  return (
    <FormControl
      ref={anchorRef}
      size="small"
      sx={{
        minWidth: { xs: minWidth, sm: 180 },
        maxWidth: { xs: "calc(100vw - 56px)", sm: 360 },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        label={label}
        variant="outlined"
        sx={{
          ".MuiSelect-select": {
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{
          ...menuPositionProps,
          slotProps: {
            paper: {
              sx: {
                maxHeight: menuMaxHeight,
                overflowY: "auto",
              },
            },
          },
        }}
      >
        {values.map((val, i) => (
          <MenuItem key={label + i} value={val}>
            <Typography sx={{ textTransform: "capitalize" }}>{val}</Typography>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
