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

  const remainingSeconds = parseRemainingTime(message);

  if (remainingSeconds) {
    return new CustomEvent("game.remaining_seconds", {
      detail: remainingSeconds,
    });
  }

  const overtimeMinutes = parseOvertime(message);

  if (overtimeMinutes) {
    return new CustomEvent("game.overtime_minutes", {
      detail: overtimeMinutes,
    });
  }

  switch (message) {
    case "The match has begun!":
      return new CustomEvent("game.match_begin");
    case "The match is over":
      return new CustomEvent("game.match_end");
    case "svc_disconnect: EndOfDemo":
      return new CustomEvent("fte.event.qtv_disconnect");
    default:
      return null;
  }
}

function parseOvertime(message: string): number | undefined {
  const matches = message.match(/\[(\d+)] minutes? overtime follows/gi);

  if (!matches || 0 === matches.length) {
    return undefined;
  }

  return Number.parseInt(matches[1]);
}

function parseRemainingTime(message: string): number | undefined {
  const timeRegex = /\[(\d+)] (second|minute)/gi;
  const matches = timeRegex.exec(message);

  if (!matches || 0 === matches.length) {
    return undefined;
  }

  const value = Number.parseInt(matches[1]);
  return message.includes(" seconds") ? value : value * 60;
}
