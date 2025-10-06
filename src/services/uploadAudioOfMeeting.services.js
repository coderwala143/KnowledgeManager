import { supabase } from "../supabaseClient.js";

const uploadAudioOfMeeting = async (file) => {
  const bucketName = process.env.SUPABASE_BUCKET_NAME;
  console.log("Uploading file to bucket:", file.originalname);
  if (!bucketName) {
    throw new ApiError(500, "Supabase bucket name not configured");
  }

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

  if (error) {
    throw new ApiError(500, "Error uploading file to Supabase", [
      error.message,
    ]);
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(fileName, 60 * 60 * 24); // URL valid for 1 hour

  if (urlError) {
    throw new ApiError(500, "Error generating signed URL", [urlError.message]);
  }

  return {
    fileUrl: signedUrlData.signedUrl,
    fileName,
  }
};

export { uploadAudioOfMeeting };