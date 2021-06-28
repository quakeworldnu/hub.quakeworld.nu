export const randomString = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");

const quakeCharToPlainChar = (char) => {
  let charCode = char.charCodeAt(0);

  if (charCode >= 128) {
    charCode -= 128;
  }

  if (charCode < 16 || (charCode >= 29 && charCode <= 31)) {
    return "_";
  } else if (charCode === 16) {
    return "[";
  } else if (charCode === 17) {
    return "]";
  } else if (charCode >= 18 && charCode <= 27) {
    return String.fromCharCode(charCode - 18 + 48);
  } else if (charCode === 28) {
    return "•";
  } else if (charCode >= "A" && charCode <= "Z") {
    return String.fromCharCode(charCode + ("a" - "A"));
  } else {
    return String.fromCharCode(charCode);
  }
};

export const quakeTextToPlainText = (input) =>
  input
    .split("")
    .map((c) => quakeCharToPlainChar(c))
    .join("");

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
