import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
} from "@mui/material";
import { ExpandMore, FilterList } from "@mui/icons-material";
import { FC, useEffect, useState } from "react";
import {
  HEADER_COMPACT_MAX,
  TABLE_COLLAPSED_MAX,
  TABLE_EXPANDED_MIN,
} from "../../lib/layout";
import { ARMOR_TYPES, formatSlot } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectHeaderModel } from "../../store/viewSelectors";
import { dataSlice } from "../../store/slices/dataSlice";
import FilterMenu from "./FilterMenu";
import Select from "./Select";

const Header: FC = () => {
  const [armorAnchor, setArmorAnchor] = useState<null | HTMLElement>(null);
  const [slotAnchor, setSlotAnchor] = useState<null | HTMLElement>(null);
  const {
    armorLabel,
    armorTypes,
    column,
    columnLabel,
    group,
    grouping,
    groups,
    isBossTable,
    showArmor,
    showColumn,
    showGroup,
    showSlot,
    slotLabel,
    slots,
    columnOptions,
    slotByOption,
  } = useAppSelector(selectHeaderModel);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!showArmor) setArmorAnchor(null);
  }, [showArmor]);

  useEffect(() => {
    if (!showSlot) setSlotAnchor(null);
  }, [showSlot]);

  const largeOnlySx = isBossTable
    ? {
        [TABLE_COLLAPSED_MAX]: {
          display: "none",
        },
      }
    : undefined;
  const smallOnlySx = isBossTable
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
            label={columnLabel}
            value={column}
            values={columnOptions}
            formatValue={columnLabel === "Slot" ? formatSlot : undefined}
            optionSecondaryText={slotByOption}
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
            onClick={(event) =>
              setSlotAnchor(slotAnchor ? null : event.currentTarget)
            }
            size="small"
            startIcon={<FilterList fontSize="small" />}
            variant={slots.length ? "contained" : "outlined"}
            sx={filterButtonSx(Boolean(slots.length))}
          >
            {slotLabel}
          </Button>

          <FilterMenu
            anchor={slotAnchor}
            id="slot-filter-menu"
            onClose={() => setSlotAnchor(null)}
          >
            {columnOptions.map((slot) => {
              const selected = slots.includes(slot);

              return (
                <MenuItem
                  key={slot}
                  onClick={() => dispatch(dataSlice.actions.toggleSlot(slot))}
                >
                  <Checkbox checked={selected} size="small" />
                  <ListItemText primary={formatSlot(slot)} />
                </MenuItem>
              );
            })}
          </FilterMenu>
        </FormControl>
      ) : null}

      {showArmor ? (
        <FormControl sx={{ minWidth: 160, ...largeOnlySx }}>
          <Button
            aria-controls={armorAnchor ? "armor-filter-menu" : undefined}
            aria-expanded={armorAnchor ? "true" : undefined}
            aria-haspopup="menu"
            endIcon={<ExpandMore fontSize="small" />}
            onClick={(event) =>
              setArmorAnchor(armorAnchor ? null : event.currentTarget)
            }
            size="small"
            startIcon={<FilterList fontSize="small" />}
            variant={armorTypes.length ? "contained" : "outlined"}
            sx={filterButtonSx(Boolean(armorTypes.length))}
          >
            {armorLabel}
          </Button>

          <FilterMenu
            anchor={armorAnchor}
            id="armor-filter-menu"
            onClose={() => setArmorAnchor(null)}
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
          </FilterMenu>
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
        zIndex: "appBar",
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
