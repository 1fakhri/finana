interface StoredScreenshot {
  buffer: Buffer;
  mimeType: string;
}

const store = new Map<string, StoredScreenshot>();

export function storeScreenshot(
  taskId: string,
  buffer: Buffer,
  mimeType: string = "image/png",
): void {
  store.set(taskId, { buffer, mimeType });
}

export function getScreenshot(
  taskId: string,
): StoredScreenshot | undefined {
  return store.get(taskId);
}

export function deleteScreenshot(taskId: string): void {
  store.delete(taskId);
}
