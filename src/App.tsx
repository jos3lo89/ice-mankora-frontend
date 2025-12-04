import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { ThemeProvider } from "./components/theme/theme-provider";
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ice-mankora-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
export default App;
