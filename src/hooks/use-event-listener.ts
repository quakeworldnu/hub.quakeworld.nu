import { useEventListener as uhUseEventListener } from "usehooks-ts";

export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  uhUseEventListener(eventName, handler);
}
