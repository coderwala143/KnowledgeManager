import { GoogleGenAI } from "@google/genai";
import { Transcript } from "../models/transcript.models.js";
import { json } from "express";

const googleGenAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateMeetingNotes(transcript) {
  
  const prompt = `
You are an AI assistant that extracts useful notes from a meeting transcript.
Here is the transcript:
---
${transcript}
---

Please return structured JSON with:
1. summary: short overview (3-5 sentences),
2. keyPoints: list of important discussion points,
3. actionItems: list of tasks/decisions.
`;

  const response = await googleGenAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let result = response.candidates[0].content.parts[0].text;
  console.log("Generated Notes: ", result);
  result = result
    .split("```json")[1]
    ?.split("```")[0]
    .trim()
    .replaceAll(/\n/g, "");
  console.log("Extracted JSON Notes: ", result);
  const finalResult = JSON.parse(result);
//   transcript.notes = finalResult;
//   transcript.notesCreated = true;
//   await transcript.save();

//   return transcript.notes;
    return finalResult;
}

export { generateMeetingNotes };
