import ScreenProvider from "./Context/ScreenContext";
import ThemeProvider from "./Context/ThemeContext";
import Drops from "./Drops";

const Home = () => {
  return (
    <ScreenProvider>
      <ThemeProvider>
        <Drops />
      </ThemeProvider>
    </ScreenProvider>
  );
};

export default Home;
