export function enableLogToEvents() {
  const log = console.log;

  function customLog(...args: any[]) {
    if (ignoreMessage(args[0])) {
      return;
    }

    inspectMessage(args[0]);
    log.apply(console, args);
  }

  console.log = customLog;
}

function ignoreMessage(message: string): boolean {
  const ignored_prefixes = ["Unrecognised ", "execing particles/"];

  for (const prefix of ignored_prefixes) {
    if (message.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

function inspectMessage(message: string) {
  const event = eventByMessage(message);

  if (event) {
    window.dispatchEvent(event);
  }
}

function eventByMessage(message: string): CustomEvent | null {
  if (message.startsWith(`streaming "tcp:`)) {
    return new CustomEvent("fte.event.qtv_play");
  }

  switch (message) {
    case "svc_disconnect: EndOfDemo":
      return new CustomEvent("fte.event.qtv_disconnect");
    default:
      return null;
  }
}
