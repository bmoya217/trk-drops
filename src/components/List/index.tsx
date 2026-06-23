import { Box, Chip, Divider, Link, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Grouping } from "../../lib/types";
import { openUrl } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { selectListModel } from "../../store/viewSelectors";
import ItemLabel from "../ItemLabel";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const getValueColor = (value: unknown) => {
  if (typeof value !== "number") return "text.secondary";
  if (value > 0) return "success.main";
  if (value < 0) return "error.main";

  return "text.secondary";
};

const List: FC = () => {
  const { bossItems, grouping, playerSections, showEmpty } =
    useAppSelector(selectListModel);

  if (showEmpty) {
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
    return (
      <Stack divider={<Divider />} sx={{ width: "100%" }}>
        {playerSections.map(({ slot, items }) => (
          <Box key={slot} sx={{ py: 1.5 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1, mb: 1 }}
            >
              {slot}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {items.map((item) => (
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
        ))}
      </Stack>
    );
  }

  return (
    <Stack divider={<Divider />} sx={{ width: "100%" }}>
      {bossItems.length ? (
        bossItems.map((item) => (
          <Box key={item.item} sx={{ py: 1.5 }}>
            <Box
              sx={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <ItemLabel
                bold
                item={
                  <Link
                    color="inherit"
                    href={item.link}
                    underline="none"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.link) openUrl(item.link);
                    }}
                  >
                    {item.item}
                  </Link>
                }
                slot={item.slot}
              />
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
