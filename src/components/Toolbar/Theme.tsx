import { DarkMode, LightMode } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { FC, useContext } from "react";
import { openUrl } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";
import { ThemeContext } from "../../store/ThemeContext";
import Raidbots from "./Raidbots";

const Theme: FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const links = useAppSelector(dataSlice.selectors.selectLinks);

  const link = group + "_" + difficulty;
  const raidbots = links?.[link];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: 1,
        pt: { xs: 0.5, sm: 1 },
      }}
    >
      {/* sim link when grouping by player */}
      {raidbots ? (
        <Fab size="small" onClick={() => openUrl?.(raidbots)}>
          <Raidbots />
        </Fab>
      ) : null}

      {/* dark mode */}
      <Fab
        size="small"
        onClick={() =>
          setTheme?.((theme) => (theme === "light" ? "dark" : "light"))
        }
      >
        {theme?.palette?.mode === "light" ? <DarkMode /> : <LightMode />}
      </Fab>
    </Box>
  );
};

export default Theme;
