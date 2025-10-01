import axios from "axios";
import { Transcript } from "../models/transcript.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;

const createTranscription = asyncHandler(async (req, res) => {
  const { userId, fileName } = req.body;
  if (!userId || !fileName) {
    throw new ApiError(400, "userId and fileName are required");
  }

  const transcriptRecord = await Transcript.create({
    userId,
    fileName,
  });

  const { data: signedData, error: signedError } = await supabase.storage
    .from("meeting-audio")
    .createSignedUrl(fileName, 60 * 60);

  if (signedError) {
    throw new ApiError(500, "Error generating signed URL", [
      signedError.message,
    ]);
  }

  const audioUrl = signedData.signedUrl;

  const assemblyResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    { audio_url: audioUrl },
    { headers: { authorization: ASSEMBLYAI_KEY } }
  );

  const transcriptId = assemblyResponse.data.id;

  // 4. Poll until transcription is complete
  let completed = false;
  let transcriptText = "";
  while (!completed) {
    const checkResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: ASSEMBLYAI_KEY } }
    );

    const status = checkResponse.data.status;
    if (status === "completed") {
      completed = true;
      transcriptText = checkResponse.data.text;
    } else if (status === "failed") {
      completed = true;
      transcriptRecord.status = "failed";
      transcriptRecord.error = "Transcription failed";
      await transcriptRecord.save();
      return res.status(500).json({ error: "Transcription failed" });
    } else {
      // wait 2 seconds before next poll
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

    // 5. Save transcript
    transcriptRecord.transcriptText = transcriptText;
    transcriptRecord.status = 'completed';
    await transcriptRecord.save();

    res.status(200).json(new ApiResponse(200, transcriptRecord, "Transcription completed"));
});

export { createTranscription };
