import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const Timestamp = ({ timestamp }: { timestamp: string | null }) => {
  if (null === timestamp) {
    return null;
  }

  const ts = dayjs(timestamp);
  const relative = ts.from(dayjs());
  const local = ts.format("YYYY-MM-DD HH:mm");

  return <span title={local}>{relative}</span>;
};
