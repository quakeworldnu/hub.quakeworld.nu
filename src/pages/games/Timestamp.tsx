import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const Timestamp = ({ timestamp }: { timestamp: string | null }) => {
  const format = dayjs(timestamp).from(dayjs());

  return <>{format}</>;
};
