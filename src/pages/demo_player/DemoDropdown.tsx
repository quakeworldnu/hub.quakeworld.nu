import { ChangeEvent, useEffect, useState } from "react";

import { getDemoUrls } from "./services/aws.ts";
import { demoUrlToTitle } from "./demoUtil.ts";

type Demo = {
  url: string;
  title: string;
};

export function DemoDropdown(props: {
  currentValue: string;
  onChange: (demoUrl: string) => void;
}) {
  const [demos, setDemos] = useState<Demo[]>([]);

  useEffect(() => {
    async function run() {
      const demoUrls = await getDemoUrls();
      const demos = demoUrls.map((url) => ({
        url,
        title: demoUrlToTitle(url),
      }));
      demos.sort((a, b) => a.title.localeCompare(b.title));
      setDemos(demos);
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
      {demos.map((demo) => (
        <option key={demo.title} value={demo.url}>
          {demo.title}
        </option>
      ))}
    </select>
  );
}
