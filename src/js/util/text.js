export const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");
export const pluralize = (value, count) => (1 === count ? value : `${value}s`);
export const quakeTextToHtml = (text, color) => {
  let result = "";
  let lastColor = "";

  for (let i = 0; i < text.length; ++i) {
    let charColor = color[i];

    if (charColor !== lastColor) {
      if (i > 0) {
        result += "</span>";
      }

      result += `<span class="qw-color-${charColor}">`;
    }

    let charValue = text[i];

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

  return result;
};
