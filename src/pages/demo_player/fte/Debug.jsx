export const Debug = (props) => {
  return (
    <div className="text-xs font-mono text-left">
      <pre>{JSON.stringify({ props }, null, 2)}</pre>
    </div>
  );
};
