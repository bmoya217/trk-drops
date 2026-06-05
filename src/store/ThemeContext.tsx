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
  ReactNode,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "light" | "dark";
export const THEME_STORAGE_KEY = "theme-mode";
const THEME_MAX_AGE = 60 * 60 * 24 * 365;

interface Context {
  mode?: ThemeMode;
  theme?: Theme;
  setTheme?: Dispatch<SetStateAction<ThemeMode>>;
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
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const getInitialTheme = (fallback: ThemeMode): ThemeMode => {
  if (typeof window === "undefined") return fallback;

  const cookieTheme = document.cookie.match(
    /(?:^|; )theme-mode=(light|dark)(?:;|$)/
  )?.[1];
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : cookieTheme === "light" || cookieTheme === "dark"
      ? cookieTheme
      : fallback;
};

const ThemeProvider: FC<{ children: ReactNode; initialMode?: ThemeMode }> = ({
  children,
  initialMode = "dark",
}) => {
  const [theme, setTheme] = useState<ThemeMode>(initialMode);
  const activeTheme = theme === "light" ? light : dark;
  const value = useMemo(
    () => ({
      mode: theme,
      theme: activeTheme,
      setTheme,
    }),
    [activeTheme, theme]
  );

  useIsomorphicLayoutEffect(() => {
    const initialTheme = getInitialTheme(initialMode);

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.style.colorScheme = initialTheme;
  }, [initialMode]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.cookie = `${THEME_STORAGE_KEY}=${theme}; max-age=${THEME_MAX_AGE}; path=/; samesite=lax`;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
