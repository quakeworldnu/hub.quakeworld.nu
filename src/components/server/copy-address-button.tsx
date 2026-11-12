import { useEffect, useState } from "react";

// copies text to the clipboard, isCopied is true for a short while after copying
export function useCopyToClipboard(): [boolean, (text: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timeout = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  }

  return [isCopied, copy];
}

// ghost button, copies the address to the clipboard
export const CopyAddressButton = (props: {
  address: string;
  className?: string;
}) => {
  const { address, className = "" } = props;
  const [isCopied, copy] = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(address)}
      title="Copy IP to clipboard"
      className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded font-mono text-xs text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer whitespace-nowrap ${className}`}
    >
      {address}
      {isCopied ? (
        <span className="text-green-400 font-sans">Copied</span>
      ) : (
        <img
          src="https://hub.quakeworld.nu/assets/img/icons/content_paste.svg"
          width="12"
          alt=""
          className="app-icon inline"
        />
      )}
    </button>
  );
};
