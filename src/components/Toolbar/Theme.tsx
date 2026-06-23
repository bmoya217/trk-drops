import { DarkMode, LightMode } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { FC, useContext } from "react";
import { HEADER_COMPACT_MAX } from "../../lib/layout";
import { useAppSelector } from "../../store/hooks";
import { ThemeContext } from "../../store/ThemeContext";
import { selectRaidbotsLink } from "../../store/viewSelectors";
import Raidbots from "./Raidbots";

const Theme: FC = () => {
  const { mode, setTheme } = useContext(ThemeContext);
  const raidbots = useAppSelector(selectRaidbotsLink);

  return (
    <Box
      sx={{
        alignItems: "center",
        alignSelf: "center",
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        paddingInlineEnd: 6,
        justifyContent: "flex-end",
        [HEADER_COMPACT_MAX]: {
          gap: 0.5,
          paddingInlineEnd: 2,
        },
      }}
    >
      {/* sim link when grouping by player */}
      {raidbots ? (
        <Fab
          component="a"
          href={raidbots}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          aria-label="Open Raidbots report"
        >
          <Raidbots />
        </Fab>
      ) : null}

      {/* dark mode */}
      <Fab
        size="small"
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} theme`}
        onClick={() =>
          setTheme?.((theme) => (theme === "light" ? "dark" : "light"))
        }
      >
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </Fab>
    </Box>
  );
};

export default Theme;
