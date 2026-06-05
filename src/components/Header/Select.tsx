import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { HEADER_COMPACT_MAX } from "../../lib/layout";
import { menuPositionProps } from "./menu";

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
  const minWidth = label === "Item" ? 208 : 144;

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 180,
        maxWidth: 360,
        [HEADER_COMPACT_MAX]: {
          minWidth,
          maxWidth: "calc(100vw - 56px)",
        },
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
                maxHeight: "calc(100vh - 96px)",
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
