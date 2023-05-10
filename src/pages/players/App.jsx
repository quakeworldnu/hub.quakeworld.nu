import React from "react";
import { useGetServersQuery } from "@/services/hub/hub";
import { SiteHeader } from "@/site/Header";
import { SiteFooter } from "@/site/Footer";
import { coloredQuakeName, QuakeText } from "@/QuakeText";
import { ServerAddress } from "@/servers/Server";

export const App = () => {
  const { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 10000,
  });

  const clients = [];
  const serversObj = [];

  function addClient(name, name_color = "", status, address) {
    clients.push({
      name: name,
      name_color: name_color,
      status: status,
      id: [address, status, name, name_color].join("-"),
      address,
    });
  }

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    serversObj[server.address] = server;
    const address = server.address;

    server.players.forEach((client) => {
      if (!client.is_bot) {
        addClient(client.name, client.name_color, "Playing", address);
      }
    });

    server.spectator_names.forEach((clientName) => {
      addClient(clientName, "", "Spectating", address);
    });

    server.qtv_stream.spectator_names.forEach((clientName) => {
      addClient(clientName, "", "Spectating (QTV)", address);
    });
  }

  clients.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  return (
    <>
      <SiteHeader />

      <div className="my-6">
        <table cellPadding="10" className="text-left w-full lg:w-auto">
          <thead className="text-gray-600">
            <tr>
              <th className="w-48">Name</th>
              <th className="w-28 hidden md:table-cell">Status</th>
              <th className="min-w-[160px]">Server</th>
              <th className="min-w-[160px] hidden sm:table-cell"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <ClientRow key={c.id} client={c} server={serversObj[c.address]} />
            ))}
          </tbody>
        </table>
      </div>

      <SiteFooter />
    </>
  );
};

export default App;

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
