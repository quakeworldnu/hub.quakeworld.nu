import { renderPage } from "@/pages/render-page";
import { ServersPage } from "./servers-page";

renderPage(<ServersPage />);

if (import.meta.env.PROD) {
  console.log(`
██╗  ██╗██╗   ██╗██████╗ 
██║  ██║██║   ██║██╔══██╗
███████║██║   ██║██████╔╝
██╔══██║██║   ██║██╔══██╗
██║  ██║╚██████╔╝██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═════╝

source code: https://github.com/quakeworldnu/hub.quakeworld.nu
`);
}
