/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/uploadImage.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const uploadImageToCloudinary = async (file: string | Blob) => {
  console.log(
    "Here Look: ",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload?upload_preset=${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.secure_url; // Returns the public URL of the uploaded image
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export const uploadPdfToCloudinary = async (file: any) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload?upload_preset=${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.secure_url; // Returns the public URL of the uploaded image
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to Cloudinary");
  }
};
