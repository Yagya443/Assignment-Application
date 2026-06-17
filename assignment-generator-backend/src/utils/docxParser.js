const mammoth = require("mammoth");
const { v4: uuidv4 } = require("uuid");

/**
 * Parses a DOCX file and extracts sections where each section is:
 * - Title: a paragraph where ALL runs are bold
 * - Content: everything between that bold paragraph and the next bold paragraph
 *
 * @param {string} filePath - absolute path to the uploaded .docx file
 * @returns {Promise<Array>} - array of { id, title, content, words, included }
 */
const parseDocxSections = async (filePath) => {
    // Extract raw messages with bold run info using mammoth's raw messages
    const result = await mammoth.extractRawText({ path: filePath });

    // Use mammoth's custom transform to detect bold paragraphs
    const customResult = await mammoth.convertToHtml(
        { path: filePath },
        {
            styleMap: [
                "b => b",
                "strong => strong",
            ],
        }
    );

    // Parse bold-headed sections from the HTML output
    const sections = extractSectionsFromHtml(customResult.value);
    return sections;
};

/**
 * Parses mammoth HTML output to detect bold-only paragraphs as section titles.
 * Content between two bold titles belongs to the first title's section.
 */
const extractSectionsFromHtml = (html) => {
    // Split HTML into paragraph blocks
    const paragraphRegex = /<p>(.*?)<\/p>/gs;
    const paragraphs = [];

    let match;
    while ((match = paragraphRegex.exec(html)) !== null) {
        paragraphs.push(match[1].trim());
    }

    const sections = [];
    let currentSection = null;
    let contentBuffer = [];

    for (const para of paragraphs) {
        if (isEntirelyBold(para)) {
            // Save previous section
            if (currentSection !== null) {
                sections.push(buildSection(currentSection, contentBuffer));
            }
            // Start new section
            currentSection = stripHtml(para).trim();
            contentBuffer = [];
        } else {
            // Accumulate content
            const text = stripHtml(para).trim();
            if (text) contentBuffer.push(text);
        }
    }

    // Push the last section
    if (currentSection !== null) {
        sections.push(buildSection(currentSection, contentBuffer));
    }

    return sections;
};

/**
 * Returns true if the paragraph's visible text is entirely wrapped in <b> or <strong>.
 * Handles: <b>text</b>, <strong>text</strong>, mixed runs where ALL text is bold.
 */
const isEntirelyBold = (paraHtml) => {
    // Remove all bold tags and check if non-bold text remains
    const withoutBold = paraHtml
        .replace(/<b>(.*?)<\/b>/gs, "")
        .replace(/<strong>(.*?)<\/strong>/gs, "");

    const remainingText = stripHtml(withoutBold).trim();

    // The original paragraph must have some text
    const originalText = stripHtml(paraHtml).trim();

    return originalText.length > 0 && remainingText.length === 0;
};

/**
 * Strips all HTML tags from a string.
 */
const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

/**
 * Builds a section object from title + content lines.
 */
const buildSection = (title, contentLines) => ({
    id: uuidv4(),
    title,
    content: contentLines.join("\n\n"),
    words: 200,
    included: true,
});

module.exports = { parseDocxSections };
