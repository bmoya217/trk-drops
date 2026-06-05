import { Avatar, Box, Toolbar as MuiToolbar } from "@mui/material";
import { FC } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Theme from "./Theme";

const Toolbar: FC = () => {
  return (
    <MuiToolbar
      disableGutters
      variant="regular"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 1.5,
        minHeight: "auto",
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          minWidth: 0,
        }}
      >
        <Avatar
          src="/images/trk.png"
          alt="TRK"
          sx={{
            width: { xs: 48, sm: 64 },
            height: { xs: 48, sm: 64 },
            flexShrink: 0,
          }}
        />

        <Breadcrumbs />
      </Box>

      <Theme />
    </MuiToolbar>
  );
};

export default Toolbar;
