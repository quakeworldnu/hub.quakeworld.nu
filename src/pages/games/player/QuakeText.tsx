import { toColoredHtml } from "../qwstrings.ts";

export const QuakeTextFromBytes = ({ name }: { name: number[] }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: toColoredHtml(String.fromCharCode(...name)),
      }}
    />
  );
};
