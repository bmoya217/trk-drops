import { Avatar, Box, Toolbar as MuiToolbar } from "@mui/material";
import { FC } from "react";
import { HEADER_COMPACT_MAX } from "../../lib/layout";
import DataControls from "./DataControls";
import Theme from "./Theme";

const Toolbar: FC = () => {
  return (
    <MuiToolbar
      disableGutters
      variant="regular"
      sx={{
        alignItems: "center",
        display: "flex",
        gap: 1.5,
        justifyContent: "space-between",
        minHeight: "auto",
        position: "relative",
        py: 1,
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
          [HEADER_COMPACT_MAX]: {
            gap: 1,
          },
        }}
      >
        <Avatar
          src="/images/trk.png"
          alt="TRK"
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            [HEADER_COMPACT_MAX]: {
              width: 48,
              height: 48,
            },
          }}
        />

        <DataControls />
      </Box>

      <Theme />
    </MuiToolbar>
  );
};

export default Toolbar;
