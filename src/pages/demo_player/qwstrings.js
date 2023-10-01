export function toPlainText(input, keepNewLines) {
  let str = "";
  if (!input) {
    return str;
  }

  for (let i = 0; i < input.length; ++i) {
    let ch = input.charCodeAt(i);
    if (ch >= 128) {
      ch = ch - 128;
    }

    if (keepNewLines && (ch === 10 || ch === 13)) {
      str += String.fromCharCode(ch);
    } else if (ch < 16 || (ch >= 29 && ch <= 31)) {
      str += "_";
    } else if (ch === 16) {
      str += "[";
    } else if (ch === 17) {
      str += "]";
    } else if (ch >= 18 && ch <= 27) {
      str += String.fromCharCode(ch - 18 + 48);
    } else if (ch === 28) {
      str += "&#8226;";
    } else if (ch >= "A" && ch <= "Z") {
      str += String.fromCharCode(ch + ("a" - "A"));
    } else {
      str += String.fromCharCode(ch);
    }
  }
  return str;
}

export function toColoredHtml(input, maxLength, keepNewLines) {
  let str = "";
  let type = "normal";

  let changeType = function (newType) {
    if (type !== newType) {
      if (type !== "normal") {
        str += "</span>";
      }
      if (newType !== "normal") {
        str += '<span class="qw-color-' + newType.toLowerCase() + '">';
      }
      type = newType;
    }
  };

  for (let i = 0; i < input.length; ++i) {
    if (maxLength >= 0 && i >= maxLength) {
      break;
    }

    let ch = input.charCodeAt(i);
    if (ch >= 128) {
      ch = ch - 128;
    }

    if (keepNewLines && (ch === 10 || ch === 13)) {
      str += String.fromCharCode(ch);
    } else if (ch < 16 || (ch >= 29 && ch <= 31)) {
      changeType("normal");
      str += "_";
    } else if (ch === 16) {
      changeType("g");
      str += "[";
    } else if (ch === 17) {
      changeType("g");
      str += "]";
    } else if (ch >= 18 && ch <= 27) {
      let num = ch - 18 + 48;
      changeType("g");
      str += String.fromCharCode(num);
    } else if (ch === 28) {
      changeType("normal");
      str += "&#8226;";
    } else {
      if (input.charCodeAt(i) >= 128 + 32) {
        changeType("b");
      } else {
        changeType("normal");
      }

      if (ch === "<") {
        str += "&lt;";
      } else if (ch === ">") {
        str += "&gt;";
      } else if (ch === '"') {
        str += "&quot;";
      } else {
        str += String.fromCharCode(ch);
      }
    }
  }
  changeType("normal");

  return str;
}
