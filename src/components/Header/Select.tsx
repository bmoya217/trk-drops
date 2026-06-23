import { ExpandMore } from "@mui/icons-material";
import { Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import { type FC, useId, useState } from "react";
import { HEADER_COMPACT_MAX } from "../../lib/layout";
import ItemLabel from "../ItemLabel";
import FilterMenu from "./FilterMenu";

interface Props<T> {
  label: string;
  value: T;
  values: T[];
  onChange?: (value: T) => void;
  optionSecondaryText?: Record<string, string>;
  formatValue?: (value: T) => string;
}

const Select: FC<Props<string>> = ({
  label,
  value,
  values,
  onChange,
  optionSecondaryText,
  formatValue = (option) => option,
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const minWidth = label === "Item" ? 208 : 144;
  const buttonId = `${id}-button`;
  const labelId = `${id}-label`;
  const menuId = `${id}-menu`;

  return (
    <FormControl
      size="small"
      sx={{
        maxWidth: 360,
        minWidth: 180,
        [HEADER_COMPACT_MAX]: {
          maxWidth: "calc(100vw - 56px)",
          minWidth,
        },
      }}
    >
      <InputLabel
        htmlFor={buttonId}
        id={labelId}
        shrink
        sx={{ bgcolor: "background.default", px: 0.5 }}
      >
        {label}
      </InputLabel>
      <Button
        aria-controls={anchor ? menuId : undefined}
        aria-expanded={anchor ? "true" : undefined}
        aria-haspopup="menu"
        aria-labelledby={`${labelId} ${buttonId}`}
        endIcon={<ExpandMore fontSize="small" />}
        id={buttonId}
        onClick={(event) => setAnchor(anchor ? null : event.currentTarget)}
        variant="outlined"
        sx={{
          borderColor: "divider",
          color: "text.primary",
          justifyContent: "space-between",
          minHeight: 40,
          overflow: "hidden",
          textTransform: "none",
        }}
      >
        <ItemLabel item={formatValue(value)} noWrap />
      </Button>

      <FilterMenu anchor={anchor} id={menuId} onClose={() => setAnchor(null)}>
        {values.map((option, index) => (
          <MenuItem
            key={`${label}-${index}`}
            selected={option === value}
            onClick={() => {
              onChange?.(option);
              setAnchor(null);
            }}
          >
            <ItemLabel
              item={formatValue(option)}
              slot={optionSecondaryText?.[option]}
            />
          </MenuItem>
        ))}
      </FilterMenu>
    </FormControl>
  );
};

export default Select;
