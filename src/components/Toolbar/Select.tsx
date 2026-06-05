import {
  Chip,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  FC,
  Fragment,
  ReactElement,
  SetStateAction,
  useRef,
} from "react";

export enum Open {
  Difficulty = "Difficulty",
  Grouping = "Grouping",
  View = "View",
  Closed = "Closed",
}

interface Props<T> {
  open: Open;
  setOpen: Dispatch<SetStateAction<Open>>;
  icon: ReactElement;
  label: Open;
  value: T;
  values: T[];
  setState: Dispatch<SetStateAction<T>>;
  onChange?: (value: T) => void;
}

const Select: FC<Props<string>> = ({
  open,
  setOpen,
  icon,
  label,
  value,
  values,
  setState,
  onChange,
}) => {
  const anchorRef = useRef();

  return (
    <Fragment>
      <Chip
        ref={anchorRef}
        icon={icon}
        label={value}
        size="small"
        aria-label={`${label}: ${value}`}
        sx={{
          textTransform: "capitalize",
          minWidth: 96,
          justifyContent: "flex-start",
          ".MuiChip-label": {
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
        onClick={() => setOpen((o) => (o === label ? Open.Closed : label))}
      />

      <Popper
        open={open === label}
        anchorEl={anchorRef.current}
        transition
        sx={{ zIndex: 69420 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper sx={{ border: 1, m: 1 }}>
              <MenuList>
                {values.map((item, i) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        setState(item);
                        onChange?.(item);
                        setOpen(Open.Closed);
                      }}
                      key={label + i}
                    >
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {item}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default Select;
