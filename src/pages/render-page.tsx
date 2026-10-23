import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "@/lib/query-client";
import "@/styles/index.css";

// mount a page into #root
// strictMode: false for pages hosting the fte player (the engine is a global singleton)
export function renderPage(page: ReactNode, { strictMode = true } = {}) {
  const app = (
    <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
  );

  createRoot(document.getElementById("root") as HTMLElement).render(
    strictMode ? <StrictMode>{app}</StrictMode> : app,
  );
}
