export const copyToClipBoard = (textToCopy) => {
  let successUsingApi = false;

  try {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(textToCopy);
      }
    });

    successUsingApi = true;
  } catch (err) {}

  if (!successUsingApi) {
    try {
      const textarea = document.getElementById("app-clipboard");
      textarea.innerText = textToCopy;
      textarea.select();
      document.execCommand("copy");
    } catch (err) {}
  }
};
