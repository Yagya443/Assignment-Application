const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates content for a single section using Gemini.
 *
 * @param {string} sectionTitle   - e.g. "Theory:"
 * @param {string} experimentName - e.g. "CPU Scheduling Algorithms"
 * @param {number} wordCount      - target word count
 * @returns {Promise<string>}     - generated text content
 */
const generateSectionContent = async (sectionTitle, experimentName, wordCount) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are writing a student lab assignment report.
        
        Experiment: "${experimentName}"
        Section: "${sectionTitle}"
        
        Write the "${sectionTitle}" section for this lab experiment in approximately ${wordCount} words.
        Write in a clear, academic tone suitable for a university lab report.
        Do NOT include any headings, titles, or markdown — output plain paragraphs only.
        `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
};

module.exports = { generateSectionContent };
