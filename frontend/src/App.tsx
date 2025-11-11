import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes";
import AuthValidate from "@/components/auth/AuthValidate";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthValidate />
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  );
};

export default App;
