/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCroppedImg = async (imageSrc: string, cropArea: any) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { width, height } = cropArea;

  canvas.width = 96; // Fixed width for logo
  canvas.height = 96; // Fixed height for logo

  ctx?.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob!));
    }, "image/jpeg");
  });
};
