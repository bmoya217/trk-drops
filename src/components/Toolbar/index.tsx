import { Avatar, Box, Toolbar as MuiToolbar } from "@mui/material";
import { FC } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Theme from "./Theme";

const Toolbar: FC = () => {
  return (
    <MuiToolbar
      disableGutters
      variant="regular"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Avatar
          src="/images/trk.png"
          alt="TRK"
          sx={{ width: 64, height: 64 }}
        />

        <Breadcrumbs />
      </Box>

      <Theme />
    </MuiToolbar>
  );
};

export default Toolbar;
