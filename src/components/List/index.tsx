import {
  Box,
  Chip,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import {
  Grouping,
  type ArmorType,
  type ByDifficulty,
  type Difficulty,
  type Links,
  type Row,
} from "../../lib/types";
import {
  filterRowsByArmorTypes,
  getHeadCells,
  getLink,
  openUrl,
} from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const SLOT_ORDER = [
  "head",
  "neck",
  "shoulder",
  "back",
  "chest",
  "wrist",
  "hands",
  "waist",
  "legs",
  "feet",
  "finger",
  "trinket",
  "one-hand",
  "two-hand",
  "off hand",
  "held in off-hand",
  "ranged",
];

const META_KEYS = new Set(["Item", "Player", "color", "classId"]);

interface PlayerListItem {
  item: string;
  link: string | undefined;
  slot: string;
  value: Row[string];
}

interface BossListPlayer {
  color: string;
  link: string | undefined;
  player: string;
  value: Row[string];
}

interface BossListItem {
  item: string;
  link: string | undefined;
  players: BossListPlayer[];
  slot: string;
}

const getSlot = (row: Row) =>
  Object.keys(row).find((key) => !META_KEYS.has(key)) ?? "";

const getSlotOrder = (slot: string) => {
  const index = SLOT_ORDER.indexOf(slot.toLowerCase());
  return index === -1 ? SLOT_ORDER.length : index;
};

const getValueColor = (value: unknown) => {
  if (typeof value !== "number") return "text.secondary";
  if (value > 0) return "success.main";
  if (value < 0) return "error.main";

  return "text.secondary";
};

const getItemSlots = (playerRows: Row[]) =>
  playerRows.reduce<Record<string, string>>((slots, row) => {
    const item = row.Item as string;
    const slot = getSlot(row);
    if (!item || !slot) return slots;

    return {
      ...slots,
      [item]: slot,
    };
  }, {});

const getBossItemSlot = (item: string, itemSlots: Record<string, string>) => {
  if (itemSlots[item]) return itemSlots[item];
  if (item.endsWith(" tier")) return item.replace(" tier", "");
  return "";
};

const sortBySlotThenValue = (a: PlayerListItem, b: PlayerListItem) => {
  const slotDiff = getSlotOrder(a.slot) - getSlotOrder(b.slot);
  if (slotDiff) return slotDiff;

  return Number(b.value ?? 0) - Number(a.value ?? 0);
};

const sortByValue = (
  a: { value: Row[string] },
  b: { value: Row[string] },
) => Number(b.value ?? 0) - Number(a.value ?? 0);

const getPlayerListItems = ({
  difficulty,
  links,
  rows,
}: {
  difficulty: Difficulty;
  links: Links;
  rows: Row[];
}) =>
  rows
    .map((row): PlayerListItem => {
      const slot = getSlot(row);

      return {
        item: row.Item as string,
        link: getLink(row, difficulty, links),
        slot,
        value: row[slot],
      };
    })
    .filter((item) => item.item && item.slot)
    .sort(sortBySlotThenValue);

const getBossListItems = ({
  armorTypes,
  data,
  difficulty,
  links,
  rows,
}: {
  armorTypes: ArmorType[];
  data: ByDifficulty;
  difficulty: Difficulty;
  links: Links;
  rows: Row[];
}) => {
  const bossRows = filterRowsByArmorTypes(rows, armorTypes);
  const itemSlots = getItemSlots(Object.values(data[difficulty].Player).flat());

  return getHeadCells(bossRows, Grouping.Boss)
    .slice(1)
    .map((item): BossListItem => {
      const players = bossRows
        .filter((row) => row[item] !== undefined)
        .map((row) => ({
          color: row.color as string,
          link: getLink(row, difficulty, links),
          player: row.Player as string,
          value: row[item],
        }))
        .sort(sortByValue);

      return {
        item,
        link: links?.[`${item}_${difficulty}`],
        players,
        slot: getBossItemSlot(item, itemSlots),
      };
    })
    .filter((item) => item.players.length);
};

const List: FC = () => {
  const data = useAppSelector(dataSlice.selectors.selectData);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const links = useAppSelector(dataSlice.selectors.selectLinks);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const rows = useAppSelector(dataSlice.selectors.selectRows);

  if (!rows.length && !loading) {
    return (
      <Box
        sx={{
          display: "grid",
          minHeight: 160,
          placeItems: "center",
          width: "100%",
        }}
      >
        <Typography color="text.secondary">No valid reports :)</Typography>
      </Box>
    );
  }

  if (grouping === Grouping.Player) {
    const itemsBySlot = getPlayerListItems({ difficulty, links, rows });

    return (
      <Stack divider={<Divider />} sx={{ width: "100%" }}>
        {SLOT_ORDER.map((slot) => {
          const slotItems = itemsBySlot.filter((item) => item.slot === slot);
          if (!slotItems.length) return null;

          return (
            <Box key={slot} sx={{ py: 1.5 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1, mb: 1 }}
              >
                {slot}
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {slotItems.map((item) => (
                  <Chip
                    key={`${item.slot}-${item.item}`}
                    label={
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          color="text.primary"
                          component="span"
                          fontWeight="bold"
                          variant="caption"
                        >
                          {item.item}
                        </Typography>

                        <Typography
                          color={getValueColor(item.value)}
                          component="span"
                          fontWeight="bold"
                          variant="caption"
                        >
                          {typeof item.value === "number"
                            ? formatter.format(item.value)
                            : item.value}
                        </Typography>
                      </Box>
                    }
                    size="small"
                    sx={{
                      borderColor: "divider",
                      maxWidth: "100%",
                      "& .MuiChip-label": {
                        minWidth: 0,
                      },
                    }}
                    variant="outlined"
                    onClick={() => item.link && openUrl(item.link)}
                  />
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    );
  }

  const items = getBossListItems({
    armorTypes,
    data,
    difficulty,
    links,
    rows,
  });

  return (
    <Stack divider={<Divider />} sx={{ width: "100%" }}>
      {items.length ? (
        items.map((item) => (
          <Box key={item.item} sx={{ py: 1.5 }}>
            <Box
              sx={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Link
                color="inherit"
                href={item.link}
                underline="none"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.link) openUrl(item.link);
                }}
              >
                <Typography fontWeight="bold">{item.item}</Typography>
              </Link>

              {item.slot ? (
                <Typography color="text.secondary" variant="caption">
                  {item.slot}
                </Typography>
              ) : null}

              <Typography color="text.secondary" variant="caption">
                {item.players.length}{" "}
                {item.players.length === 1 ? "player" : "players"}
              </Typography>
            </Box>

            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
              {item.players.map((player) => (
                <Chip
                  key={`${item.item}-${player.player}`}
                  label={
                    <Box
                      sx={{ alignItems: "center", display: "flex", gap: 0.75 }}
                    >
                      <Typography
                        component="span"
                        sx={{ color: player.color, fontWeight: "bold" }}
                        variant="caption"
                      >
                        {player.player}
                      </Typography>

                      <Typography
                        color={getValueColor(player.value)}
                        component="span"
                        fontWeight="bold"
                        variant="caption"
                      >
                        {typeof player.value === "number"
                          ? formatter.format(player.value)
                          : player.value}
                      </Typography>
                    </Box>
                  }
                  size="small"
                  sx={{
                    borderColor: "divider",
                  }}
                  variant="outlined"
                  onClick={() => player.link && openUrl(player.link)}
                />
              ))}
            </Stack>
          </Box>
        ))
      ) : (
        <Box sx={{ display: "grid", minHeight: 160, placeItems: "center" }}>
          <Typography color="text.secondary">No matching drops :)</Typography>
        </Box>
      )}
    </Stack>
  );
};

export default List;
