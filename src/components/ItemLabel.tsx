import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { formatSlot } from "../lib/utils";

interface Props {
  item: ReactNode;
  slot?: ReactNode;
  bold?: boolean;
  noWrap?: boolean;
}

const ItemLabel: FC<Props> = ({ item, slot, bold, noWrap }) => (
  <Box
    component="span"
    sx={{
      alignItems: "baseline",
      display: "flex",
      gap: 1,
      maxWidth: "100%",
      minWidth: 0,
    }}
  >
    <Box
      component="span"
      sx={{
        fontWeight: bold ? "bold" : undefined,
        minWidth: 0,
        overflow: noWrap ? "hidden" : undefined,
        textOverflow: noWrap ? "ellipsis" : undefined,
        textTransform: "inherit",
        whiteSpace: noWrap ? "nowrap" : undefined,
      }}
    >
      {item}
    </Box>

    {slot ? (
      <Typography
        color="text.secondary"
        component="span"
        noWrap
        sx={{ flexShrink: 0, textTransform: "capitalize" }}
        variant="caption"
      >
        {typeof slot === "string" ? formatSlot(slot) : slot}
      </Typography>
    ) : null}
  </Box>
);

export default ItemLabel;
