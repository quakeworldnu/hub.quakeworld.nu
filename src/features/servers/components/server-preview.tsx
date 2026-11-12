import {
  type MouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useEventListener } from "usehooks-ts";
import type { Server as ServerType } from "@/lib/qworld/types";
import { Server } from "./server";

const HIDE_DELAY_MS = 150; // time to move the pointer from the row to the card
const WIDTH = 340; // same as a grid tile
const GAP = 12; // between pointer and card
const MARGIN = 8; // to the viewport edges

type Anchor = { address: string; x: number; top: number };

// keep the card (and e.g. its server info dialog) while a modal dialog is open
const isModalOpen = () => null !== document.querySelector("dialog:modal");

// hover card: a server grid tile next to the hovered row (pointer devices only)
export function useServerPreview() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancelHide = useCallback(() => clearTimeout(hideTimeout.current), []);

  const hide = useCallback(() => {
    clearTimeout(hideTimeout.current);
    if (!isModalOpen()) {
      setAnchor(null);
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(hide, HIDE_DELAY_MS);
  }, [hide]);

  const show = useCallback((address: string, e: MouseEvent<HTMLElement>) => {
    if (isModalOpen() || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    clearTimeout(hideTimeout.current);
    const { top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    setAnchor((prev) =>
      prev?.address === address && prev.top === top
        ? prev
        : { address, x, top },
    );
  }, []);

  // fixed position goes stale on scroll
  useEventListener("scroll", hide);

  return { anchor, show, hide, scheduleHide, cancelHide };
}

export type ServerPreviewState = ReturnType<typeof useServerPreview>;

// renders the hover card for the hovered server (latest data, keeps updating while polling)
export const ServerPreviewPortal = ({
  preview,
  servers,
}: {
  preview: ServerPreviewState;
  servers: ServerType[];
}) => {
  const { anchor } = preview;
  const server = anchor
    ? servers.find((s) => s.address === anchor.address)
    : undefined;

  if (!anchor || !server) {
    return null;
  }

  return (
    <ServerPreview
      anchor={anchor}
      server={server}
      onMouseEnter={preview.cancelHide}
      onMouseLeave={preview.scheduleHide}
    />
  );
};

const ServerPreview = ({
  anchor,
  server,
  onMouseEnter,
  onMouseLeave,
}: {
  anchor: Anchor;
  server: ServerType;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number }>();

  // right of the pointer (left if it doesn't fit), top aligned with the row,
  // so the pointer can move straight into the card without crossing other rows
  useLayoutEffect(() => {
    const height = ref.current?.offsetHeight ?? 0;
    const fitsRight = anchor.x + GAP + WIDTH + MARGIN <= window.innerWidth;
    const left = fitsRight
      ? anchor.x + GAP
      : Math.max(MARGIN, anchor.x - GAP - WIDTH);
    const top = Math.max(
      MARGIN,
      Math.min(anchor.top, window.innerHeight - height - MARGIN),
    );
    setPosition({ left, top });
  }, [anchor, server]);

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 shadow-2xl shadow-black/60"
      style={{
        width: WIDTH,
        left: position?.left ?? 0,
        top: position?.top ?? 0,
        visibility: position ? "visible" : "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Server server={server} />
    </div>,
    document.body,
  );
};
