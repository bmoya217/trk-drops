import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material";
import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface Context {
  theme?: Theme;
  setTheme?: Dispatch<SetStateAction<"light" | "dark">>;
}

const dark = createTheme({
  palette: {
    mode: "dark",
  },
});

const light = createTheme({
  palette: {
    mode: "light",
  },
});

export const ThemeContext = createContext<Context>({});

const ThemeProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme: theme === "light" ? light : dark,
        setTheme,
      }}
    >
      <MuiThemeProvider theme={theme === "light" ? light : dark}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
