const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', "chat-teen-files");

  try {
    // Ensure the fetch call is awaited
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    console.log("DONE")

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("DONE")
    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Optional: rethrow the error to handle it outside the function
  }
};

export default uploadFile;
