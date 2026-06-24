import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Context {
  isLargeScreen: boolean;
  width: number;
}

const getViewport = () => ({
  width: window.innerWidth,
});

const getScreenContext = (viewport: { width: number }) => ({
  isLargeScreen: viewport.width >= 1000,
  width: viewport.width,
});

export const ScreenContext = createContext<Context>({
  isLargeScreen: false,
  width: 0,
});

export const useScreen = () => useContext(ScreenContext);

const ScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState({ width: 1024 });

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
