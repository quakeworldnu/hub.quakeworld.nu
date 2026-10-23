export const Matchtag = ({ text = "" }: { text?: string | null }) => {
  if ((text ?? "").trim().length === 0) {
    return null;
  }

  return (
    <div className="mb-3 py-1.5 uppercase font-bold tracking-widest text-xs text-center w-full bg-linear-to-r from-red-600/0 via-red-600 app-text-shadow">
      {text}
    </div>
  );
};
