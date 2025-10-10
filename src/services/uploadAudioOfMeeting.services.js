import { supabase } from "../utils/supabaseClient.js";

const uploadAudioOfMeeting = async (file) => {
  console.log("step one");
  const bucketName = process.env.SUPABASE_BUCKET_NAME;
  console.log("Uploading file to bucket:", file.originalname);
  if (!bucketName) {
    throw new ApiError(500, "Supabase bucket name not configured");
  }
  console.log("step two");
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const fileBuffer = file.buffer;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });
  console.log("step three");
  if (error) {
    throw new ApiError(500, "Error uploading file to Supabase", [
      error.message,
    ]);
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(fileName, 60 * 60 * 24); // URL valid for 1 hour
  console.log("step four");
  if (urlError) {
    throw new ApiError(500, "Error generating signed URL", [urlError.message]);
  }
  console.log("step five");

  return {
    fileUrl: signedUrlData.signedUrl,
    fileName,
  };
};

export { uploadAudioOfMeeting };
