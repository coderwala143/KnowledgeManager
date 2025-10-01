import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { supabase } from "../supabaseClient.js";



const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }
  const bucketName = process.env.SUPABASE_BUCKET_NAME;
  console.log("Uploading file to bucket:", req.file.originalname);
  if (!bucketName) {
    throw new ApiError(500, "Supabase bucket name not configured");
  }

  const fileExtension = req.file.originalname.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const fileBuffer = req.file.buffer;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: req.file.mimetype,
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
        throw new ApiError(500, "Error uploading file to Supabase", [error.message]);
    }

    const {data: signedUrlData, error: urlError} = await supabase.storage.from(bucketName).createSignedUrl(fileName, 60 * 60 * 24); // URL valid for 1 hour

    if (urlError) {
        throw new ApiError(500, "Error generating signed URL", [urlError.message]);
    }
    res.status(200).json(new ApiResponse(true, 200, "File uploaded successfully", { fileUrl: signedUrlData.signedUrl }));
})

export { uploadAudio };