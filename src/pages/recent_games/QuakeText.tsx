export const QuakeText = ({ text, color }: { text: string; color: string }) => {
  let result = "";
  let lastColor = "";

  for (let i = 0; i < text.length; ++i) {
    const charColor = color[i];

    if (charColor !== lastColor) {
      if (i > 0) {
        result += "</span>";
      }

      result += `<span class="qw-color-${charColor}">`;
    }

    const charValue = text[i];

    if (charValue === "<") {
      result += "&lt;";
    } else if (charValue === ">") {
      result += "&gt;";
    } else if (charValue === '"') {
      result += "&quot;";
    } else {
      result += charValue;
    }

    lastColor = charColor;
  }

  result += "</span>";

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
};
