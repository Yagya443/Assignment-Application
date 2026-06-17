const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROK_API_KEY,
});

const generateSectionContent = async (
    sectionTitle,
    experimentName,
    wordCount,
    userTextRequest,
) => {
    const messages = [
        {
            role: "system",
            content:
                "You are writing college assignment content. Return only the final answer. Never show reasoning, thinking process, explanations, or <think> tags. No headings, markdown, or bullet points. Use simple student language.",
        },
        {
            role: "user",
            content: `
Experiment: ${experimentName}
Section: ${sectionTitle}
Length: ${wordCount} words

Return ONLY the requested content.
Never show thinking, reasoning, analysis, chain of thought, or <think> tags.
Never explain your answer.
Never describe what you are doing.
Output only the final content.
${userTextRequest || ""}`,
        },
    ];

    let retries = 3;

    while (retries > 0) {
        try {
            const completion = await groq.chat.completions.create({
                messages,
                model: "qwen/qwen3-32b",
                temperature: 0.7,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error("Groq Error:", error);

            retries--;

            if (retries === 0) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};

module.exports = { generateSectionContent };
