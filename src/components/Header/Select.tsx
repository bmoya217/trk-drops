import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import { FC } from "react";

export enum Open {
  Team = "Team",
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
  return (
    <FormControl sx={{ m: 2, mr: 0 }}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        label={label}
        variant='standard'
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
