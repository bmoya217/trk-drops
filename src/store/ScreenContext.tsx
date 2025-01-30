import { createContext, FC, ReactElement, useEffect, useState } from "react";
import { Screen } from "../../public/types";
import { getHeight, getWidth } from "../../public/utils";

interface Context {
  size?: Screen;
  height: number;
  width: number;
}

export const ScreenContext = createContext<Context>({ height: 0, width: 0 });

const ScreenProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [height, setHeight] = useState(69420);
  const [width, setWidth] = useState(69420);

  useEffect(() => {
    const handleResize = () => {
      setHeight(getHeight());
      setWidth(getWidth());
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
        size: width < 1000 ? Screen.Small : Screen.Large,
        height,
        width,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenProvider;
