import {
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
};

// modal <dialog> (focus trap, Esc to close, ::backdrop), closes on backdrop click (light dismiss)
// rendered in <body> and only renders its content while open
export const Dialog = ({
  open,
  onClose,
  label,
  className,
  children,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  useModalState(ref, open);

  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      className={className}
      onClose={onClose}
      onClick={lightDismissFallback}
      {...({ closedby: "any" } as object)}
    >
      {open && children}
    </dialog>,
    document.body,
  );
};

export function useModalState(
  ref: RefObject<HTMLDialogElement | null>,
  open: boolean,
) {
  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);
}

// for browsers without <dialog closedby> support (safari)
export function lightDismissFallback(e: MouseEvent<HTMLDialogElement>) {
  const dialog = e.currentTarget;

  if ("closedBy" in HTMLDialogElement.prototype || e.target !== dialog) {
    return;
  }

  // the dialog itself is the target for clicks on both its padding and the backdrop
  const rect = dialog.getBoundingClientRect();
  const isInside =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (!isInside) {
    dialog.close();
  }
}
