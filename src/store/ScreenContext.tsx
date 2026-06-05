import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Screen } from "../lib/types";

interface Context {
  size: Screen;
  height: number;
  isLargeScreen: boolean;
  isSmallScreen: boolean;
  shouldCollapseFilters: boolean;
  width: number;
}

const getViewport = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

const getScreenSize = (width: number) =>
  width < 1000 ? Screen.Small : Screen.Large;

const getScreenContext = (viewport: { height: number; width: number }) => {
  const size = getScreenSize(viewport.width);

  return {
    height: viewport.height,
    isLargeScreen: size === Screen.Large,
    isSmallScreen: size === Screen.Small,
    shouldCollapseFilters: viewport.width < 760,
    size,
    width: viewport.width,
  };
};

export const ScreenContext = createContext<Context>({
  height: 0,
  isLargeScreen: false,
  isSmallScreen: true,
  shouldCollapseFilters: true,
  size: Screen.Small,
  width: 0,
});

export const useScreen = () => useContext(ScreenContext);

const ScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState({ height: 768, width: 1024 });

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewport());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ScreenContext.Provider value={getScreenContext(viewport)}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenProvider;
