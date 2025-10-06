import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { supabase } from "../supabaseClient.js";
import { Transcript } from "../models/transcript.models.js";
import { uploadAudioOfMeeting } from "../services/uploadAudioOfMeeting.services.js";

const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }
  const { fileUrl: signedUrl, fileName } = await uploadAudioOfMeeting(req.file);

  // Create transcript record immediately
  const transcript = await Transcript.create({
    userId: req.body.userId, // comes from frontend auth/session
    fileName,
    status: "pending",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        fileUrl: signedUrl,
        transcriptId: transcript._id,
      },
      "File uploaded successfully"
    )
  );
});

export { uploadAudio };
