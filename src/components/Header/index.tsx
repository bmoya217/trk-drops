import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { ExpandMore, FilterList } from "@mui/icons-material";
import { FC, useContext, useState } from "react";
import { Grouping, Screen, View } from "../../../public/types";
import { ARMOR_TYPES } from "../../../public/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ScreenContext } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import Select from "./Select";

const Header: FC = () => {
  const [armorAnchor, setArmorAnchor] = useState<null | HTMLElement>(null);
  const [slotAnchor, setSlotAnchor] = useState<null | HTMLElement>(null);
  const { size } = useContext(ScreenContext);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const slots = useAppSelector(dataSlice.selectors.selectSlots);
  const groups = useAppSelector(dataSlice.selectors.selectGroups);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const dispatch = useAppDispatch();

  const showGroup = group && groups.length;
  const showColum =
    (view === View.Chart ||
      (view === View.Table &&
        size === Screen.Small &&
        grouping === Grouping.Boss)) &&
    showGroup &&
    headCells.length > 1;
  const showSlot =
    grouping === Grouping.Player && view === View.Table && headCells.length > 1;
  const showArmor =
    grouping === Grouping.Boss &&
    (view === View.List || (view === View.Table && size === Screen.Large));
  const armorLabel = !armorTypes.length
    ? "Armor"
    : armorTypes.length === 1
      ? `Armor: ${armorTypes[0]}`
      : `Armor: ${armorTypes.length} selected`;
  const slotLabel = !slots.length
    ? "Slot"
    : slots.length === 1
      ? `Slot: ${slots[0]}`
      : `Slot (${slots.length})`;
  const slotValues = headCells.slice(1);
  const filterButtonSx = (active: boolean) => ({
    borderColor: active ? "primary.main" : "divider",
    borderRadius: 6,
    color: active ? "primary.contrastText" : "text.primary",
    justifyContent: "space-between",
    minHeight: 40,
    textTransform: "none",
    "&:hover": active
      ? undefined
      : {
          bgcolor: "action.hover",
          borderColor: "text.secondary",
        },
  });

  const controls = (
    <>
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

      {showSlot ? (
        <FormControl sx={{ minWidth: { xs: 132, sm: 160 } }}>
          <Button
            aria-controls={slotAnchor ? "slot-filter-menu" : undefined}
            aria-expanded={slotAnchor ? "true" : undefined}
            aria-haspopup="menu"
            endIcon={<ExpandMore fontSize="small" />}
            onClick={(event) => setSlotAnchor(event.currentTarget)}
            size="small"
            startIcon={<FilterList fontSize="small" />}
            variant={slots.length ? "contained" : "outlined"}
            sx={filterButtonSx(Boolean(slots.length))}
          >
            {slotLabel}
          </Button>

          <Menu
            anchorEl={slotAnchor}
            id="slot-filter-menu"
            onClose={() => setSlotAnchor(null)}
            open={Boolean(slotAnchor)}
          >
            {slotValues.map((slot) => {
              const selected = slots.includes(slot);

              return (
                <MenuItem
                  key={slot}
                  onClick={() => dispatch(dataSlice.actions.toggleSlot(slot))}
                >
                  <Checkbox checked={selected} size="small" />
                  <ListItemText primary={slot} />
                </MenuItem>
              );
            })}
          </Menu>
        </FormControl>
      ) : null}

      {showArmor ? (
        <FormControl sx={{ minWidth: { xs: 140, sm: 160 } }}>
          <Button
            aria-controls={armorAnchor ? "armor-filter-menu" : undefined}
            aria-expanded={armorAnchor ? "true" : undefined}
            aria-haspopup="menu"
            endIcon={<ExpandMore fontSize="small" />}
            onClick={(event) => setArmorAnchor(event.currentTarget)}
            size="small"
            startIcon={<FilterList fontSize="small" />}
            variant={armorTypes.length ? "contained" : "outlined"}
            sx={filterButtonSx(Boolean(armorTypes.length))}
          >
            {armorLabel}
          </Button>

          <Menu
            anchorEl={armorAnchor}
            id="armor-filter-menu"
            onClose={() => setArmorAnchor(null)}
            open={Boolean(armorAnchor)}
          >
            {ARMOR_TYPES.map((armorType) => {
              const selected = armorTypes.includes(armorType);

              return (
                <MenuItem
                  key={armorType}
                  onClick={() =>
                    dispatch(dataSlice.actions.toggleArmorType(armorType))
                  }
                >
                  <Checkbox checked={selected} size="small" />
                  <ListItemText primary={armorType} />
                </MenuItem>
              );
            })}
          </Menu>
        </FormControl>
      ) : null}
    </>
  );

  return (
    <Box
      sx={{
        alignItems: "flex-end",
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 1.5 },
        position: "relative",
        py: 1.5,
      }}
    >
      {controls}
    </Box>
  );
};

export default Header;
