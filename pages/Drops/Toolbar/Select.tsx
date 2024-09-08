import {
  Fab,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from "@mui/material";
import { Dispatch, FC, Fragment, ReactElement, SetStateAction, useRef } from "react";

export enum Open {
  Team = "Team",
  Difficulty = "Difficulty",
  Grouping = "Grouping",
  Group = "Group",
  Column = "Column",
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
      <Fab
        ref={anchorRef}
        size="small"
        variant="extended"
        onClick={() => setOpen((o) => (o === label ? Open.Closed : label))}
        sx={{ m: 1, minWidth: 120 }}
      >
        {icon}
        <Typography variant="subtitle1" fontWeight={"bold"} sx={{ m: 1 }}>
          {value}
        </Typography>
      </Fab>
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
            <MenuList
              id="composition-menu"
              sx={{
                border: 1,
                m: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
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
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default Select;
