import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "A numerical score from 0 to 100 representing how well the resume matches the job description."
        },
        matchedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 5-7 top keywords and skills from the job description that are present in the resume."
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 5-7 top keywords and skills from the job description that are missing from the resume."
        },
        tailoredResumeText: {
            type: Type.STRING,
            description: "The complete, rewritten resume text, professionally tailored to perfectly match the job description, integrating missing keywords naturally and highlighting relevant experiences. The format should be clean, professional, and easily readable."
        },
        jobTitle: {
            type: Type.STRING,
            description: "A short, concise job title extracted from the job description."
        }
    },
    required: ["matchScore", "matchedKeywords", "missingKeywords", "tailoredResumeText", "jobTitle"]
};

export const generateContent = async (resumeText: string, jobDescText: string): Promise<AnalysisResult> => {
    const prompt = `
        Act as an expert career coach and professional resume writer. Your task is to meticulously analyze the provided resume against the job description and generate a comprehensive analysis and an improved, tailored resume.

        **Input Details:**
        1.  **Resume:** 
            \`\`\`
            ${resumeText}
            \`\`\`
        2.  **Job Description:** 
            \`\`\`
            ${jobDescText}
            \`\`\`

        **Instructions:**
        1.  **Calculate Match Score:** Based on the alignment of skills, experience, and keywords, calculate a "match score" from 0 to 100.
        2.  **Keyword Analysis:** Identify the top 5-7 most critical keywords/skills from the job description. Categorize them into "matched" (present in the resume) and "missing" (absent from the resume).
        3.  **Rewrite Resume:** Rewrite the entire resume. The new version must be professionally tailored for the specific job description. Seamlessly integrate the missing keywords, rephrase bullet points using action verbs, and quantify achievements where possible to better align with the job requirements. The tone should be professional and confident.
        4.  **Extract Job Title:** Identify and extract the core job title from the description.

        **Output Format:**
        You must return ONLY a single valid JSON object that adheres to the defined schema. Do not include any markdown formatting (e.g., \`\`\`json) or any explanatory text outside of the JSON object itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as AnalysisResult;
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
};

export const generateCoverLetter = async (resumeText: string, jobDescText: string, userNotes: string): Promise<string> => {
    const prompt = `
        Act as an expert career coach and professional writer. Your task is to write a compelling and professional cover letter.

        **Context:**
        - The user has already tailored their resume for the job.
        - The goal is to create a cover letter that complements the resume and strongly positions the candidate for an interview.

        **Input Details:**
        1.  **User's Tailored Resume:** 
            \`\`\`
            ${resumeText}
            \`\`\`
        2.  **Target Job Description:** 
            \`\`\`
            ${jobDescText}
            \`\`\`
        3.  **User's Personal Notes (optional points to include):**
            \`\`\`
            ${userNotes || "No specific notes provided."}
            \`\`\`
            
        **Instructions:**
        1.  **Opening:** Start with a strong, engaging opening that grabs the reader's attention and clearly states the position being applied for.
        2.  **Body Paragraphs:** 
            - Connect the candidate's key skills and experiences from the resume directly to the most critical requirements in the job description. 
            - Use 2-3 paragraphs to highlight specific achievements or projects that demonstrate their qualifications.
            - If the user provided personal notes, seamlessly integrate them into the narrative to add a personal touch.
            - Maintain a confident, professional, and enthusiastic tone.
        3.  **Closing:** Conclude with a strong closing paragraph that reiterates interest in the role, expresses eagerness for an interview, and includes a call to action.
        4.  **Formatting:** The output should be the cover letter text ONLY. Do not include a subject line, headers with personal information (like name/address), or any other text outside of the letter's content itself.

        **Output:**
        Return only the plain text of the cover letter.
    `;

     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                temperature: 0.7,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for cover letter:", error);
        throw new Error("Failed to generate cover letter from AI.");
    }
};