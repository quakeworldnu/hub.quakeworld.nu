import { QuakeText, coloredQuakeName } from "@qwhub/QuakeText";
import { selectFilteredClients, selectFilteredServers } from "@qwhub/selectors";
import { ServerAddress } from "@qwhub/servers/Server";
import { ServerPoller } from "@qwhub/servers/Servers";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";
import { useSelector } from "react-redux";

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
  const clients = useSelector(selectFilteredClients);
  const servers = useSelector(selectFilteredServers);
  const serversObj = [];

  for (let i = 0; i < servers.length; i++) {
    serversObj[servers[i].address] = servers[i];
  }

  return (
    <div className="mt-4 mb-6">
      <table cellPadding="10" className="text-left w-full lg:w-auto">
        <thead className="text-gray-400 text-sm">
          <tr>
            <th className="w-48">Name</th>
            <th className="w-28 hidden md:table-cell">Status</th>
            <th className="min-w-[160px]">Server</th>
            <th className="min-w-[160px] hidden sm:table-cell"></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow client={client} server={serversObj[client.address]} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClientRow = (props) => {
  const { client, server } = props;

  return (
    <tr className="odd:bg-white/5 hover:bg-white/10">
      <td>
        <QuakeText text={coloredQuakeName(client.name, client.name_color)} />
        <div className="md:hidden text-xs text-gray-500">{client.status}</div>
      </td>
      <td className="text-xs text-gray-500 hidden md:table-cell">
        {client.status}
      </td>
      <td className="text-sm">
        <ServerAddress server={server} />
        <div className="md:hidden mt-1 text-xs text-gray-500">
          {server.title}
        </div>
      </td>
      <td className="text-xs text-gray-500 hidden md:table-cell">
        {server.title}
      </td>
      <td className="text-sm text-right space-x-2 hidden sm:table-cell">
        {server.qtv_stream.address && (
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
