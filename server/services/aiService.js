// AI SERVICE - UPDATED TO GEMINI-PRO-LATEST FOR QUOTA STABILITY
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using gemini-pro-latest which is confirmed available in your model list
const ACTIVE_MODEL = "gemini-2.5-flash";

const analyzeResume = async (resumeText, jobDescription) => {
    console.log(`AI Analysis: Starting with ${ACTIVE_MODEL}`);
    try {
        const model = genAI.getGenerativeModel({ model: ACTIVE_MODEL });
        const prompt = `
            Analyze the following resume against the job description provided.
            Provide a ranking score out of 100 and a brief summary of strengths and weaknesses.
            Return ONLY a valid JSON object with the following schema:
            {
              "score": number, 
              "summary": "string",
              "strengths": ["string"],
              "weaknesses": ["string"]
            }

            Job Description: ${jobDescription}
            Resume Text: ${resumeText}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { score: 0, summary: "Could not parse AI response", strengths: [], weaknesses: [] };
    } catch (error) {
        console.error("AI Analysis Error Detail:", error.message);
        throw error;
    }
};

const generateInterviewQuestions = async (role, level) => {
    console.log(`Generating questions for ${role} using ${ACTIVE_MODEL}...`);
    try {
        const model = genAI.getGenerativeModel({ model: ACTIVE_MODEL });
        const prompt = `
            Generate 10 role-specific interview questions for a ${level} level ${role} position.
            Include a mix of technical and behavioral questions.
            Format the output ONLY as a JSON array of strings.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return [];
    } catch (error) {
        console.error("Question Gen Error Detail:", error.message);
        throw error;
    }
};

const generateDashboardSummary = async (stats) => {
    try {
        const model = genAI.getGenerativeModel({ model: ACTIVE_MODEL });
        const prompt = `
            Act as an AI HR Consultant. Analyze the following HR Dashboard statistics and provide a concise, high-impact strategic summary (3-4 sentences).
            Include insights on workforce size, recruitment velocity, and employee sentiment (NPS).
            
            Statistics:
            - Total Workforce: ${stats.totalWorkforce}
            - AI Resumes Screened: ${stats.aiResumesScreened}
            - Employee NPS: ${stats.employeeNps}
            - Open Job Postings: ${stats.openPostings}
            
            Format: A brief paragraph of professional advice.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Dashboard Summary Error:", error.message);
        throw error;
    }
};

module.exports = { analyzeResume, generateInterviewQuestions, generateDashboardSummary };
