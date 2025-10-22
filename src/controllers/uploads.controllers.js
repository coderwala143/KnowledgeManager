import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { supabase } from "../utils/supabaseClient.js";
import { Transcript } from "../models/transcript.models.js";
import {
  uploadAudioOfMeeting,
  uploadTranscriptOfMeeting,
} from "../services/uploadAudioOfMeeting.services.js";

const uploadFiles = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const [fileType] = req.file.mimetype.split("/");

  let fileUrl,
    fileName = "",
    transcriptText = "";

  // Upload based on file type
  if (fileType === "audio") {
    const { fileUrl: uploadedUrl, fileName: uploadedName } =
      await uploadAudioOfMeeting(req.file);
    console.log("step six");
    fileUrl = uploadedUrl;
    fileName = uploadedName;
  } else if (fileType === "application") {
    const { fileName: uploadedName, transcriptText: transcriptedText } =
      await uploadTranscriptOfMeeting(req.file);
    fileName = uploadedName;
    transcriptText = transcriptedText;
  } else {
    throw new ApiError(400, "Unsupported file type");
  }
  // Create transcript record immediately
  const transcript = await Transcript.create({
    userId: req.body.userId, // comes from frontend auth/session
    fileName,
    status: "pending",
  });
  console.log("Transcript record created: ", transcript);

  if (transcriptText.trim()) {
    req.transcriptId = transcript._id;
    req.transcriptText = transcriptText;
    req.date = req.body.meetingDate;
    next();
  } else{ 
    req.transcriptId = transcript._id;
    req.fileUrl = fileUrl;
    req.fileType = fileType;
    req.date = req.body.meetingDate;
    next();
  }
});

export { uploadFiles };
