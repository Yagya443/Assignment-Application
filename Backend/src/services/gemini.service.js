const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// console.log(genAI);

/**
 * Generates content for a single section using Gemini.
 *
 * @param {string} sectionTitle   - e.g. "Theory:"
 * @param {string} experimentName - e.g. "CPU Scheduling Algorithms"
 * @param {number} wordCount      - target word count
 * @returns {Promise<string>}     - generated text content
 */
const generateSectionContent = async (
    sectionTitle,
    experimentName,
    wordCount,
) => {
    // console.log("Generating content...");
    console.log(sectionTitle, experimentName);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const prompt = `
        Experiment: "${experimentName}"
        Section: "${sectionTitle}"

Write the "${sectionTitle}" section for this assignmnet in approximately ${wordCount} words.
Write in a clear, and simple word as the it should sound like it is been made by a student itself.
Do NOT include headings or markdown.
`;

    let retries = 3;

    while (retries > 0) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            if (error.status === 503 && retries === 0) {
                alert("Gemini busy. Retrying... Wait for few seconds");
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } else {
                throw error;
            }

            retries--;
        }
    }
};

module.exports = { generateSectionContent };
