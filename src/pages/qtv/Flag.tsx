import { getFlagUrl } from "@qwhub/services/flags.ts";

export function Flag({ cc }: { cc: string }) {
  if (!cc) {
    return null;
  }

  return (
    <img
      src={getFlagUrl(cc)}
      alt={cc}
      className="inline h-3 w-auto mr-1.5 mb-px"
    />
  );
}
