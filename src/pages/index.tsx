import type { GetServerSideProps } from "next";
import { useMemo } from "react";
import { Provider } from "react-redux";
import Drops from "../components";
import { makeStore } from "../store";
import ScreenProvider from "../store/ScreenContext";
import ThemeProvider from "../store/ThemeContext";
import {
  createInitialDataState,
  DATA_PREFERENCES_STORAGE_KEY,
} from "../store/slices/dataSlice";

type ThemeMode = "light" | "dark";

interface Props {
  dataPreferences: Parameters<typeof createInitialDataState>[0];
  themeMode: ThemeMode;
}

const getCookieValue = (cookie = "", key: string) =>
  cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${key}=`))
    ?.slice(key.length + 1);

const getThemeMode = (cookie = ""): ThemeMode => {
  const theme = getCookieValue(cookie, "theme-mode");

  return theme === "light" || theme === "dark" ? theme : "dark";
};

const getDataPreferences = (cookie = ""): Props["dataPreferences"] => {
  const preferences = getCookieValue(cookie, DATA_PREFERENCES_STORAGE_KEY);
  if (!preferences) return {};

  try {
    const parsed = JSON.parse(decodeURIComponent(preferences));

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const Home = ({
  dataPreferences,
  themeMode,
}: Props) => {
  const store = useMemo(
    () =>
      makeStore({
        data: createInitialDataState(dataPreferences),
      }),
    [dataPreferences],
  );

  return (
    <Provider store={store}>
      <ScreenProvider>
        <ThemeProvider initialMode={themeMode}>
          <Drops />
        </ThemeProvider>
      </ScreenProvider>
    </Provider>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const cookie = req.headers.cookie ?? "";

  return {
    props: {
      dataPreferences: getDataPreferences(cookie),
      themeMode: getThemeMode(cookie),
    },
  };
};

export default Home;
