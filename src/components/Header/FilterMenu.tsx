import {
  Box,
  ClickAwayListener,
  MenuList,
  Paper,
  Popper,
  Portal,
} from "@mui/material";
import { type FC, type KeyboardEvent, type ReactNode } from "react";

interface Props {
  anchor: HTMLElement | null;
  children: ReactNode;
  id: string;
  onClose: () => void;
}

const FilterMenu: FC<Props> = ({ anchor, children, id, onClose }) => {
  const closeFromKeyboard = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;

    event.stopPropagation();
    onClose();
    anchor?.focus();
  };

  return (
    <>
      {anchor ? (
        <Portal>
          <Box
            aria-hidden
            onClick={onClose}
            sx={{
              inset: 0,
              position: "fixed",
              zIndex: (theme) => theme.zIndex.appBar - 1,
            }}
          />
        </Portal>
      ) : null}

      <Popper
        anchorEl={anchor}
        id={id}
        open={Boolean(anchor)}
        placement="bottom-start"
        sx={{ zIndex: "modal" }}
        modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper elevation={8}>
            <MenuList
              autoFocusItem
              onKeyDown={closeFromKeyboard}
              sx={{ maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}
            >
              {children}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default FilterMenu;
