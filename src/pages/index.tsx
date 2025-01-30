import { Provider } from "react-redux";
import Drops from "../components";
import { store } from "../store";
import ScreenProvider from "../store/ScreenContext";
import ThemeProvider from "../store/ThemeContext";

const Home = () => {
  return (
    <Provider store={store}>
      <ScreenProvider>
        <ThemeProvider>
          <Drops />
        </ThemeProvider>
      </ScreenProvider>
    </Provider>
  );
};

export default Home;
