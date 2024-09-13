import {
  AlignHorizontalLeft,
  DarkMode,
  LightMode,
  Toc,
} from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { FC, useContext } from "react";
import { View } from "../../../../public/types";
import { openUrl } from "../../../../public/utils";
import { DataContext } from "../../context/DataContext";
import { ThemeContext } from "../../context/ThemeContext";
import Raidbots from "./Raidbots";

const Theme: FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { difficulty, group, view, setView, links } = useContext(DataContext);

  const link = group + "_" + difficulty;
  const raidbots = links?.[link];

  return (
    <Box>
      {/* sim link when grouping by player */}
      {raidbots ? (
        <Fab size="small" sx={{ m: 1 }} onClick={() => openUrl?.(raidbots)}>
          <Raidbots />
        </Fab>
      ) : null}

      {/* data view */}
      <Fab
        size="small"
        sx={{ m: 1 }}
        onClick={() =>
          setView?.((view) => (view === View.Table ? View.Chart : View.Table))
        }
      >
        {view === View.Table ? (
          <AlignHorizontalLeft />
        ) : (
          <Toc sx={{ transform: "scale(-1, -1)" }} />
        )}
      </Fab>

      {/* dark mode */}
      <Fab
        size="small"
        sx={{ m: 1 }}
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
