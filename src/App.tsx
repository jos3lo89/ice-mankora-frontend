import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/reactQuery";
import { Toaster } from "sonner";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ice-mankora-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
        <Toaster closeButton richColors position="bottom-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
export default App;
