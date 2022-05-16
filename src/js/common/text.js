export const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");
export const quakeTextToHtml = (input, maxLength) => {
  let str = "";
  let currentType = "normal";

  let changeType = function (newType) {
    if (currentType !== newType) {
      if (currentType !== "normal") {
        str += "</span>";
      }
      if (newType !== "normal") {
        str += '<span class="qw-color-' + newType + '">';
      }
      currentType = newType;
    }
  };

  for (let i = 0; i < input.length; ++i) {
    if (maxLength >= 0 && i >= maxLength) {
      break;
    }

    let charCode = input.charCodeAt(i);

    if (charCode >= 128) {
      charCode -= 128;
    }

    if (charCode < 16 || (charCode >= 29 && charCode <= 31)) {
      changeType("normal");
      str += "_";
    } else if (charCode === 16) {
      changeType("gold");
      str += "[";
    } else if (charCode === 17) {
      changeType("gold");
      str += "]";
    } else if (charCode >= 18 && charCode <= 27) {
      let num = charCode - 18 + 48;
      changeType("gold");
      str += String.fromCharCode(num);
    } else if (charCode === 28) {
      changeType("normal");
      str += "&#8226;";
    } else {
      if (input.charCodeAt(i) >= 128 + 32) {
        changeType("brown");
      } else {
        changeType("normal");
      }

      if (charCode === "<") {
        str += "&lt;";
      } else if (charCode === ">") {
        str += "&gt;";
      } else if (charCode === '"') {
        str += "&quot;";
      } else {
        str += String.fromCharCode(charCode);
      }
    }
  }
  changeType("normal");

  return str;
};
