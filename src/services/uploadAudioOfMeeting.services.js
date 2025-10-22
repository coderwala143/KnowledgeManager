import { supabase } from "../utils/supabaseClient.js";
import fs from "fs";
import axios from "axios";
import { PDFParse  } from "pdf-parse";
import mammoth from "mammoth";
import FormData from "form-data";
import ApiError from "../utils/ApiError.js";

const uploadAudioOfMeeting = async (file) => {
  const bucketName = process.env.SUPABASE_BUCKET_NAME;
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
  };
};


const uploadTranscriptOfMeeting = async (file) => {
  if (!file) throw new ApiError(400, "No file uploaded");
  console.log("Files - ", file)

  let fileType = file.mimetype.split("/")[1];
  // const filePath = file.path;
  const dataBuffer = file.buffer
  let transcriptText = "";

  try {
   
    // 📄 PDF → extract text
    if (fileType === "pdf") {
      // const dataBuffer = fs.readFileSync(filePath);
      const pdfData = new PDFParse({data: dataBuffer});
      transcriptText = (await pdfData.getText()).text;
      console.log(transcriptText)
    }

    // 🧾 DOCX → extract text
    else if (fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // const docBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: docBuffer });
      transcriptText = result.value;
    }

    // 📝 TXT → read directly
    else if (fileType === "plain") {
      // transcriptText = fs.readFileSync(filePath, "utf8");
    }

    else {
      throw new ApiError(400, "Unsupported file type");
    }

    // Cleanup temporary file
    // fs.unlinkSync(filePath);

    return {
      fileName: file.originalname,
      transcriptText: transcriptText.trim(),
    };
  } catch (error) {
    console.error("Transcript extraction failed:", error);
    throw new ApiError(500, "Failed to extract transcript");
  }
};


export { uploadAudioOfMeeting, uploadTranscriptOfMeeting };
