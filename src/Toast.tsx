import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@qwhub/FontAwesomeIcon";
import { useEffect, useRef, useSyncExternalStore } from "react";

// short-lived notifications (popover in the top layer, bottom right)
type ToastItem = { id: number; message: string };

const DURATION_MS = 1500;
let toasts: ToastItem[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function setToasts(next: ToastItem[]) {
  toasts = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toast(message: string) {
  const id = nextId++;
  setToasts([...toasts, { id, message }]);
  setTimeout(() => setToasts(toasts.filter((t) => t.id !== id)), DURATION_MS);
}

export const Toaster = () => {
  const items = useSyncExternalStore(subscribe, () => toasts);

  return (
    <>
      {items.map((item, index) => (
        <Toast key={item.id} message={item.message} index={index} />
      ))}
    </>
  );
};

const Toast = ({ message, index }: { message: string; index: number }) => {
  const ref = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    ref.current?.showPopover();
  }, []);

  return (
    <output
      ref={ref}
      {...({ popover: "manual" } as object)}
      className="app-toast"
      style={{ bottom: `${1 + index * 4.5}rem` }}
    >
      <FontAwesomeIcon icon={faCircleCheck} className="text-[#07bc0c] mr-2.5" />
      {message}
    </output>
  );
};
