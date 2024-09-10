import ScreenProvider from "../components/context/ScreenContext";
import ThemeProvider from "../components/context/ThemeContext";
import Drops from "../components/Drops";

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
