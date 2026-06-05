import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { Screen } from "../lib/types";

interface Context {
  size: Screen;
  height: number;
  width: number;
}

const getViewport = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

const getScreenSize = (width: number) =>
  width < 1000 ? Screen.Small : Screen.Large;

export const ScreenContext = createContext<Context>({
  height: 0,
  size: Screen.Small,
  width: 0,
});

const ScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState({ height: 0, width: 0 });

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
    <ScreenContext.Provider
      value={{
        height: viewport.height,
        size: getScreenSize(viewport.width),
        width: viewport.width,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenProvider;
