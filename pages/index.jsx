import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Drops from "./Drops";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Home = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Drops />
  </ThemeProvider>
);

export default Home;
