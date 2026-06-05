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
import {
  HEADER_COMPACT_MAX,
  TABLE_COLLAPSED_MAX,
  TABLE_EXPANDED_MIN,
} from "../../lib/layout";
import { Grouping, View } from "../../lib/types";
import { ARMOR_TYPES } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";
import { menuPositionProps } from "./menu";
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
  loading,
  view,
}: {
  group: string;
  grouping: Grouping;
  groups: string[];
  headCells: string[];
  loading: boolean;
  view: View;
}) => {
  const hasGroup = Boolean(!loading && group && groups.length);
  const hasMultipleColumns = headCells.length > 1;
  const isBossTable = grouping === Grouping.Boss && view === View.Table;
  const isPlayerTable = grouping === Grouping.Player && view === View.Table;

  return {
    showArmor: hasGroup && grouping === Grouping.Boss && (view === View.List || isBossTable),
    showColumn: hasGroup && hasMultipleColumns && (view === View.Chart || isBossTable),
    showGroup: hasGroup,
    showSlot: isPlayerTable && hasMultipleColumns,
  };
};

const Header: FC = () => {
  const [armorAnchor, setArmorAnchor] = useState<null | HTMLElement>(null);
  const [slotAnchor, setSlotAnchor] = useState<null | HTMLElement>(null);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const slots = useAppSelector(dataSlice.selectors.selectSlots);
  const groups = useAppSelector(dataSlice.selectors.selectGroups);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const dispatch = useAppDispatch();

  const { showArmor, showColumn, showGroup, showSlot } = getControlVisibility({
    group,
    grouping,
    groups,
    headCells,
    loading,
    view,
  });
  const armorLabel = getSelectedFilterLabel("Armor", armorTypes);
  const slotLabel = getSelectedFilterLabel("Slot", slots);
  const slotValues = headCells.slice(1);
  const largeOnlySx =
    grouping === Grouping.Boss && view === View.Table
      ? {
          [TABLE_COLLAPSED_MAX]: {
            display: "none",
          },
        }
      : undefined;
  const smallOnlySx =
    grouping === Grouping.Boss && view === View.Table
      ? {
          [TABLE_EXPANDED_MIN]: {
            display: "none",
          },
        }
      : undefined;
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
        <Box sx={smallOnlySx}>
          <Select
            label={getColumnSelectLabel(grouping)}
            value={column}
            values={headCells.slice(1)}
            onChange={(column: string) =>
              dispatch(dataSlice.actions.setColumn(column))
            }
          />
        </Box>
      ) : null}

      {showSlot ? (
        <FormControl
          sx={{
            minWidth: 160,
            [HEADER_COMPACT_MAX]: {
              minWidth: 132,
            },
          }}
        >
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
                  maxHeight: "calc(100vh - 96px)",
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
        <FormControl sx={{ minWidth: 160, ...largeOnlySx }}>
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
                  maxHeight: "calc(100vh - 96px)",
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
        gap: 1.5,
        minHeight: 64,
        position: "relative",
        py: 1.5,
        [HEADER_COMPACT_MAX]: {
          gap: 1,
        },
      }}
    >
      {controls}
    </Box>
  );
};

export default Header;
