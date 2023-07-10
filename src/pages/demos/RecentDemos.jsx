import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useGetDemosQuery } from "@/services/hub/hub";
import { columnDefs, defaultColDef, gridOptions } from "@/pages/demos/grid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./ag_theme.scss";

export const RecentDemos = () => {
  const { data = [], isLoading } = useGetDemosQuery(null, {
    pollingInterval: 60 * 1000, // 1 min
  });

  if (isLoading) {
    return (
      <div className="flex items-center h-full justify-center max-w-4xl">
        loading demos..
      </div>
    );
  }

  return (
    <div
      className="ag-theme-alpine-dark ag-theme-qwhub max-w-4xl"
      style={{ height: "100%" }}
    >
      <AgGridReact
        gridOptions={gridOptions}
        rowData={data}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        rowHeight={36}
        onFirstDataRendered={applyQueryParams}
      ></AgGridReact>
    </div>
  );
};

const applyQueryParams = (event) => {
  if (0 === window.location.search.length) {
    return;
  }

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const filters = ["qtv_address", "filename", "mode", "participants", "map"];
  let hasChangedFilters = false;

  filters.forEach((key) => {
    if (params[key]) {
      const filterInstance = event.api.getFilterInstance(key);
      filterInstance.setModel({
        type: "text",
        filter: params[key],
      });
      hasChangedFilters = true;
    }
  });

  if (hasChangedFilters) {
    event.api.onFilterChanged();
  }
};
