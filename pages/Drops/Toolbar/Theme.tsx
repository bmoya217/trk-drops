import {
  AlignHorizontalLeft,
  DarkMode,
  LightMode,
  Toc,
} from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { Dispatch, FC, SetStateAction, useContext } from "react";
import { View } from "../../../public/types";
import { ThemeContext } from "../../Context/ThemeContext";

interface Props {
  view: string;
  setView: Dispatch<SetStateAction<View>>;
}

const Theme: FC<Props> = ({ view, setView }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <Box>
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
