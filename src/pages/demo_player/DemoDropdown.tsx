import { ChangeEvent, useEffect, useState } from "react";

import { getDemoUrls } from "./aws.ts";
import { demoUrlToTitle } from "./demoUtil.ts";

export function DemoDropdown(props: {
  currentValue: string;
  onChange: (demoUrl: string) => void;
}) {
  const [demoUrls, setDemoUrls] = useState<string[]>([]);

  useEffect(() => {
    async function run() {
      setDemoUrls(await getDemoUrls());
    }

    run();
  }, []);

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    props.onChange(e.target.value);
  }

  return (
    <select
      className="bg-blue-950 text-white p-3 border border-white/30 rounded min-w-[740px]"
      onChange={onChange}
      value={props.currentValue}
    >
      <option value="" />
      {demoUrls.map((demoUrl) => (
        <option key={demoUrl} value={demoUrl}>
          {demoUrlToTitle(demoUrl)}
        </option>
      ))}
    </select>
  );
}
