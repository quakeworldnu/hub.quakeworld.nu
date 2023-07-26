import React from "react";

export const defaultColDef = {
  filter: true,
  floatingFilter: true,
  sortable: true,
  suppressMenu: true,
  flex: 1,
};

export const columnDefs = [
  {
    field: "time",
    minWidth: 150,
    maxWidth: 150,
    initialSort: "desc",
    cellRenderer: (params) => (
      <span className="text-gray-400 text-xs">{params.value}</span>
    ),
    valueGetter: (params) => {
      return params.data.time
        .substring(0, "yyyy-mm-dd hh:ii".length)
        .replace("T", " ");
    },
  },
  {
    field: "qtv_address",
    headerName: "QTV",
    minWidth: 160,
    maxWidth: 160,
    cellRenderer: (params) => {
      return (
        <a
          href={`http://${params.value}/demos/`}
          className="text-xs text-blue-500 hover:text-white"
        >
          {params.value.replace(":28000", "")}
        </a>
      );
    },
  },
  {
    field: "mode",
    minWidth: 120,
    maxWidth: 120,
    cellRenderer: (params) => {
      return (
        <div className="text-gray-400 text-right pr-2">{params.value}</div>
      );
    },
  },
  {
    field: "participants",
    headerName: "Players / Teams",
    minWidth: 140,
  },
  { field: "map", minWidth: 100, maxWidth: 140 },
  {
    headerName: "Actions",
    sortable: false,
    field: "",
    minWidth: 100,
    maxWidth: 100,
    filter: false,
    valueGetter: (params) => {
      return {
        download_url: params.data.download_url,
        qtvplay_url: params.data.qtvplay_url,
      };
    },
    cellRenderer: (params) => {
      const cls = "p-1 rounded-full bg-gray-950 opacity-60 hover:opacity-100";
      return (
        <div className="flex transition-opacity space-x-1.5 mt-1">
          <a
            href={params.value.download_url}
            className={cls}
            title="Download demo"
          >
            <img
              src="https://hub.quakeworld.nu/assets/img/icons/download.svg"
              width={16}
              height={16}
            />
          </a>
          <a
            href={`qw://qtvplay ${params.value.qtvplay_url}`}
            className={cls}
            title="Stream demo via QTV"
          >
            <img
              src="https://hub.quakeworld.nu/assets/img/icons/play_arrow.svg"
              width={16}
              height={16}
            />
          </a>
        </div>
      );
    },
  },
];

export const gridOptions = {
  enableCellTextSelection: true,
  ensureDomOrder: true,
};
