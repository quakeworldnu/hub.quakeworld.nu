import { getFlagUrl } from "@/utils/flags";

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
