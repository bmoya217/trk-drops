import ThemeProvider from "./Context/ThemeContext";
import Drops from "./Drops";

const Home = () => {
  return (
    <ThemeProvider>
      <Drops />
    </ThemeProvider>
  );
};

export default Home;
