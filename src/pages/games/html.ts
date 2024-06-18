import { DragEvent } from "react";

export function getDroppedFiles(e: DragEvent): File[] {
  if (e.dataTransfer.items) {
    return [...e.dataTransfer.items]
      .filter((i) => "file" === i.kind)
      .map((i) => i.getAsFile())
      .filter((f) => f !== null) as File[];
  } else if (e.dataTransfer.files) {
    return [...e.dataTransfer.files];
  }

  return [];
}

export async function readFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const buffer = event.target?.result;

      if (buffer instanceof ArrayBuffer) {
        resolve(new Uint8Array(buffer));
      }

      reject();
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
