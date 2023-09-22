import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HotelProvider } from "./context/HotelContext.tsx";

const queryClient = new QueryClient();

export const Root = () => (
  <QueryClientProvider client={queryClient}>
    <HotelProvider>
      <App />
    </HotelProvider>
  </QueryClientProvider>
);

const rootDiv = document.getElementById("root");
ReactDOM.createRoot(rootDiv!).render(<Root />);
