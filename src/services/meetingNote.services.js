import { GoogleGenAI } from "@google/genai";


const googleGenAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateMeetingNotes(transcript, meetingDate) {
  const prompt = `
You are an intelligent meeting notes generator AI. 
You are given a meeting transcript (which may be from a past meeting) and the actual meeting date.

Your goal:
Extract meaningful structured notes from the transcript while maintaining accuracy and context.

Meeting Date: ${meetingDate}

Transcript:
---
${transcript}
---

Please carefully analyze the transcript and return structured JSON with the following fields:

{
  "title": "A concise title of the meeting inferred from the transcript (max 10 words)",
  "summary": "A 3–5 sentence overview summarizing what the meeting was about",
  "keyPoints": ["List of key discussion points as short sentences"],
  "actionItems": [
    {
      "owner": "Name of the person responsible, if mentioned, else 'Unassigned'",
      "taskTitle": "Short descriptive title of the task (inferred or generic)",
      "task": [
        {
        "taskName": "Detailed description of the task to be done"   
        "Priority": "Extract if mentioned (e.g., High/Medium/Low), else 'Medium'",
        "DueDate": "Extract date for Each action-item in dd-mm-yy format -> like this 10-Jan-25. 
        - If a relative reference like 'tomorrow', 'next Monday', or 'end of week' is found, 
        calculate the actual date based on the meetingDate provided above. 
        - If no due date is mentioned, return null.",
        "type": "If this is only a discussion or suggestion, return 'discussion'; 
        if it’s a clear action or task to perform, return 'action'."
        "status": "pending"
        }
      ]
    }
  ]
}

Rules:
- Do NOT use vague time references like 'today', 'end of day', or 'next week' — always resolve them into a specific date using the provided meetingDate.
- If the transcript contains no action items, return an empty array for actionItems.
- If no key points are found, return an empty array for keyPoints.
- if same action item is assigned to multiple people, create separate entries for each person.
- if multiple action items are assigned to the same person, Add them in the task Object.
- if no owner is mentioned, set owner as "Unassigned".
- if no title can be inferred, set title as "Meeting Notes".
- if no summary can be inferred, set summary as "No summary available".
- Be concise, factual, and structured.
- Return only valid JSON (no markdown, no explanations, no commentary).

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
  return finalResult;
}

export { generateMeetingNotes };


