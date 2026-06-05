import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import { FC } from "react";

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
