import DataProvider from "../components/context/DataContext";
import ScreenProvider from "../components/context/ScreenContext";
import ThemeProvider from "../components/context/ThemeContext";
import Drops from "../components/Drops";

const Home = () => {
  return (
    <ScreenProvider>
      <ThemeProvider>
        <DataProvider>
          <Drops />
        </DataProvider>
      </ThemeProvider>
    </ScreenProvider>
  );
};

export default Home;
