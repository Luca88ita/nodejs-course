export const generateBase64FromImage = (
  imageFile: Blob
): Promise<string | any> => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target && e.target.result);
    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};
