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
import { FC, useState } from "react";
import { Grouping, View } from "../../lib/types";
import { ARMOR_TYPES } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useScreen } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import { getMenuMaxHeight, menuPositionProps } from "./menu";
import Select from "./Select";

const getSelectedFilterLabel = (label: string, values: string[]) => {
  if (!values.length) return label;
  if (values.length === 1) return `${label}: ${values[0]}`;

  return `${label} (${values.length})`;
};

const getColumnSelectLabel = (grouping: Grouping) => {
  if (grouping === Grouping.Boss) return "Item";

  return "Slot";
};

const getControlVisibility = ({
  group,
  grouping,
  groups,
  headCells,
  isLargeScreen,
  isSmallScreen,
  view,
}: {
  group: string;
  grouping: Grouping;
  groups: string[];
  headCells: string[];
  isLargeScreen: boolean;
  isSmallScreen: boolean;
  view: View;
}) => {
  const hasGroup = Boolean(group && groups.length);
  const hasMultipleColumns = headCells.length > 1;
  const isBossTable = grouping === Grouping.Boss && view === View.Table;
  const isPlayerTable = grouping === Grouping.Player && view === View.Table;

  return {
    showArmor:
      grouping === Grouping.Boss &&
      (view === View.List || (isBossTable && isLargeScreen)),
    showColumn:
      hasGroup &&
      hasMultipleColumns &&
      (view === View.Chart || (isBossTable && isSmallScreen)),
    showGroup: hasGroup,
    showSlot: isPlayerTable && hasMultipleColumns,
  };
};

const Header: FC = () => {
  const [armorAnchor, setArmorAnchor] = useState<null | HTMLElement>(null);
  const [slotAnchor, setSlotAnchor] = useState<null | HTMLElement>(null);
  const { height, isLargeScreen, isSmallScreen } = useScreen();
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const slots = useAppSelector(dataSlice.selectors.selectSlots);
  const groups = useAppSelector(dataSlice.selectors.selectGroups);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const dispatch = useAppDispatch();

  const { showArmor, showColumn, showGroup, showSlot } = getControlVisibility({
    group,
    grouping,
    groups,
    headCells,
    isLargeScreen,
    isSmallScreen,
    view,
  });
  const armorLabel = getSelectedFilterLabel("Armor", armorTypes);
  const slotLabel = getSelectedFilterLabel("Slot", slots);
  const armorMenuMaxHeight = getMenuMaxHeight(armorAnchor, height);
  const slotMenuMaxHeight = getMenuMaxHeight(slotAnchor, height);
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
      {showColumn ? (
        <Select
          label={getColumnSelectLabel(grouping)}
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
            {...menuPositionProps}
            slotProps={{
              paper: {
                sx: {
                  maxHeight: slotMenuMaxHeight,
                  overflowY: "auto",
                },
              },
            }}
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
            {...menuPositionProps}
            slotProps={{
              paper: {
                sx: {
                  maxHeight: armorMenuMaxHeight,
                  overflowY: "auto",
                },
              },
            }}
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
