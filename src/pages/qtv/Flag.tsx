export function Flag({ cc }: { cc: string }) {
  if (!cc) {
    return null;
  }

  return (
    <img
      src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
      width="16"
      height="11"
      className="inline mr-1 mb-px"
    />
  );
}
