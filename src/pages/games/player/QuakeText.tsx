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

export const QuakeTextFromByteString = ({ name }: { name: string }) => {
  const bytes = name.split("").map((_, index) => name.charCodeAt(index));
  return <QuakeTextFromBytes name={bytes} />;
};
