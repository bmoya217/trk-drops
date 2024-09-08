import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
  Box,
  Fab,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from "@mui/material";
import { Dispatch, FC, Fragment, SetStateAction, useRef } from "react";

export enum Open {
  Team = "Team",
  Difficulty = "Difficulty",
  Grouping = "Grouping",
  Group = "Group",
  Closed = "Closed",
}

interface Props<T> {
  open: Open;
  setOpen: Dispatch<SetStateAction<Open>>;
  icon: ReactJSXElement;
  label: Open;
  value: T;
  values: T[];
  setState: Dispatch<SetStateAction<T>>;
  onChange?: (value: T) => void;
}

const EnhancedSelect: FC<Props<string>> = ({
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
        onClick={() =>
          setOpen((o) => (o === Open.Closed ? label : Open.Closed))
        }
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
        placement="bottom"
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Box
              sx={{
                border: 1,
                m: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <MenuList id="composition-menu">
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
            </Box>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default EnhancedSelect;
