export const toBase64 = (file: File): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result !== null ? reader.result.toString() : null);
    reader.onerror = (error) => reject(error);
  });
