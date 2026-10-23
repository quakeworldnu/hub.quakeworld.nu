import { useEffect, useRef } from "react";

export function useVisibilityChange(
  onChange: (state: DocumentVisibilityState) => void,
) {
  // always call the latest callback (it may depend on state from later renders)
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    // same function reference for add/remove, otherwise the listener is never removed
    const handleChange = () => onChangeRef.current(document.visibilityState);
    document.addEventListener("visibilitychange", handleChange);
    return () => {
      document.removeEventListener("visibilitychange", handleChange);
    };
  }, []);
}
