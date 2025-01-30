import {
  AlignHorizontalLeft,
  DarkMode,
  LightMode,
  Toc,
} from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { FC, useContext } from "react";
import { View } from "../../../public/types";
import { openUrl } from "../../../public/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";
import { ThemeContext } from "../../store/ThemeContext";
import Raidbots from "./Raidbots";

const Theme: FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const group = useAppSelector(dataSlice.selectors.selectGroup);
  const view = useAppSelector(dataSlice.selectors.selectView);
  const links = useAppSelector(dataSlice.selectors.selectLinks);
  const dispatch = useAppDispatch();

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
          dispatch(
            dataSlice.actions.setView(
              view === View.Table ? View.Chart : View.Table
            )
          )
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
