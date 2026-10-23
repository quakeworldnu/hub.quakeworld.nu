import { QuakeText, quakeStringToHtml } from "@qwhub/QuakeText";
import type { Client } from "@qwhub/servers/hooks.ts";
import {
  useFilteredClients,
  useFilteredServers,
} from "@qwhub/servers/hooks.ts";
import { ServerAddress } from "@qwhub/servers/Server";
import { ServerPoller } from "@qwhub/servers/Servers";
import type { Server } from "@qwhub/services/qworld/types.ts";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";

export const App = () => {
  return (
    <>
      <SiteHeader />

      <PlayerTable />

      <SiteFooter />
      <ServerPoller />
    </>
  );
};

export default App;

const PlayerTable = () => {
  const clients = useFilteredClients();
  const servers = useFilteredServers();
  const serversObj: Record<string, Server> = {};

  for (let i = 0; i < servers.length; i++) {
    serversObj[servers[i].address] = servers[i];
  }

  return (
    <div className="mt-4 mb-6">
      <table className="text-left w-full lg:w-auto [&_td]:p-2.5 [&_th]:p-2.5">
        <thead className="text-gray-400 text-sm">
          <tr>
            <th className="w-48">Name</th>
            <th className="w-28 hidden md:table-cell">Status</th>
            <th className="min-w-[160px]">Server</th>
            <th className="min-w-[160px] hidden sm:table-cell" />
            <th />
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow
              key={`${client.name.unicode}-${client.address}-${client.status}`}
              client={client}
              server={serversObj[client.address]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClientRow = (props: { client: Client; server: Server }) => {
  const { client, server } = props;

  return (
    <tr className="odd:bg-white/5 hover:bg-white/10">
      <td>
        <QuakeText text={quakeStringToHtml(client.name)} />
        <div className="md:hidden text-xs text-gray-500">{client.status}</div>
      </td>
      <td className="text-xs text-gray-500 hidden md:table-cell">
        {client.status}
      </td>
      <td className="text-sm">
        <ServerAddress server={server} />
        <div className="md:hidden mt-1 text-xs text-gray-500">
          {server.meta.title}
        </div>
      </td>
      <td className="text-xs text-gray-500 hidden md:table-cell">
        {server.meta.title}
      </td>
      <td className="text-sm text-right space-x-2 hidden sm:table-cell">
        {server.qtv_stream && (
          <a
            href={`qw://${server.qtv_stream.url}/qtvplay`}
            className="text-blue-500 hover:text-white"
          >
            QTV
          </a>
        )}
        <a
          href={`qw://${server.address}/observe`}
          className="text-blue-500 hover:text-white"
        >
          Spectate
        </a>
        <a
          href={`qw://${server.address}/`}
          className="text-blue-500 hover:text-white"
        >
          Join
        </a>
      </td>
    </tr>
  );
};
