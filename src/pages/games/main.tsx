import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { queryClient } from "@/lib/query-client";
import App from "./games-page";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
