import axios from "axios";
import { Transcript } from "../models/transcript.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { supabase } from "../utils/supabaseClient.js";
import { generateMeetingNotes } from "../services/note.services.js";
import { generateTasksFromNotes } from "../services/task.services.js";
import { Task } from "../models/task.models.js";

const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;

const createTranscription = asyncHandler(async (req, res) => {
  //   const { transcriptId } = req.body;
  // const transcriptId = req.body;
  console.log("Request body in createTranscription - ", req.transcriptId);
  const transcriptId = req.transcriptId;
  if (!transcriptId) {
    throw new ApiError(400, "transcriptId required");
  }

  const transcript = await Transcript.findById(transcriptId);
  if (!transcript) {
    throw new ApiError(404, "Transcript record not found");
  }

  if (transcript.status === "completed") {
    return res
      .status(200)
      .json(
        new ApiResponse(200, transcript, "Transcription already completed")
      );
  }

  const fileName = transcript.fileName;
  if (!fileName) {
    throw new ApiError(400, "No file associated with this transcript");
  }

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

  const transcriptedId = assemblyResponse.data.id;

  // 4. Poll until transcription is complete
  let completed = false;
  let transcriptText = "";
  while (!completed) {
    const checkResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptedId}`,
      { headers: { authorization: ASSEMBLYAI_KEY } }
    );

    const status = checkResponse.data.status;
    if (status === "completed") {
      completed = true;
      transcriptText = checkResponse.data.text;
    } else if (status === "failed") {
      completed = true;
      transcript.status = "failed";
      transcript.errorMessage = "Transcription failed";

      await transcript.save();
      return res.status(500).json({ error: "Transcription failed" });
    } else {
      // wait 2 seconds before next poll
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  // 5. Save transcript
  console.log("Transcription completed: ", transcriptText);
  transcript.transcriptText = transcriptText;
  transcript.status = "completed";
  const notes = await generateMeetingNotes(transcriptText);
  transcript.transcriptTitle = notes.title;
  console.log("Generated Notes: ", notes);
  transcript.notes = notes;
  transcript.notesCreated = true;
  await transcript.save();
  // Generate tasks from notes
  const tasksData = await generateTasksFromNotes(transcript);


  res
    .status(200)
    .json(new ApiResponse(200, {transcript, tasksData}, "Transcription completed"));
});

const getTranscript = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Transcript id required");
  }
  const transcript = await Transcript.findById(id).populate(
    "userId",
    "name email"
  );

  if (!transcript) {
    throw new ApiError(404, "Transcript not found");
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: transcript._id,
        user: transcript.userId,
        fileName: transcript.fileName,
        status: transcript.status,
        createdAt: transcript.createdAt,
        updatedAt: transcript.updatedAt,
        transcript: transcript.status === "completed" ? transcript.text : null,
        notes: transcript.status === "completed" ? transcript.notes : null,
      },
      "Transcript fetched successfully"
    )
  );
});
const getAllTranscripts = asyncHandler(async (req, res) => {
  const transcripts = await Transcript.find().populate("userId");
  console.log(transcripts);
  if (!transcripts || transcripts.length === 0) {
    throw new ApiError(404, "No transcripts found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, transcripts, "All transcripts fetched successfully")
    );
});

export { createTranscription, getTranscript, getAllTranscripts };
