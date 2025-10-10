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
- actionItems: return array Of Objects Like This ->  
    {
      "owner": "Neha",
      "taskTitle: "fetch task title from transcript if mentioned else generic title",
      "task": ["Complete responsive testing for UI, including mobile view, today."],
      "Priority": "fetch from transcript if mentioned else medium",
      "DueDate": "fetch from transcript if mentioned else null"
    },
    if same employee has multiple task assign then make task of array

- keyPoints: return string array of important discussion points
- In a transcript, if no action items are mentioned, return an empty array for actionItems.
- If no key points are mentioned, return an empty array for keyPoints.
- summary: return a concise summary of the meeting in 3-5 sentences.

Please return structured JSON with:
1. title: title of the meeting inferred from transcript
2. summary: short overview (3-5 sentences),
3. keyPoints: list of important discussion points,
4. actionItems: list of tasks/decisions.
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
