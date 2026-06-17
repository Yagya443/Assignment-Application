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

const extractHeadingAndContent = (paraHtml) => {
    const match = paraHtml.match(/<(?:strong|b)>(.*?)<\/(?:strong|b)>(.*)/i);

    if (!match) {
        return null;
    }

    return {
        title: stripHtml(match[1]).trim(),
        content: stripHtml(match[2]).trim(),
    };
};

const parseDocxSections = async (filePath) => {
    // Extract raw messages with bold run info using mammoth's raw messages
    const result = await mammoth.extractRawText({ path: filePath });

    // Use mammoth's custom transform to detect bold paragraphs
    const customResult = await mammoth.convertToHtml(
        { path: filePath },
        {
            styleMap: ["b => b", "strong => strong"],
        },
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
        if (isSectionHeading(para)) {
            if (currentSection !== null) {
                sections.push(buildSection(currentSection, contentBuffer));
            }

            const headingData = extractHeadingAndContent(para);

            currentSection = headingData.title;
            contentBuffer = [];

            if (headingData.content) {
                contentBuffer.push(headingData.content);
            }
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
const isSectionHeading = (paraHtml) => {
    const trimmed = paraHtml.trim();

    return (
        trimmed.startsWith("<strong>") ||
        trimmed.startsWith("<b>")
    );
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
