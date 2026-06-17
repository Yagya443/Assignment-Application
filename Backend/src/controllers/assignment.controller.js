const fs = require("fs");
const path = require("path");
const { parseDocxSections } = require("../utils/docxParser");
const { generateSectionContent } = require("../services/gemini.service");
const { generateAssignmentDocx } = require("../services/docxGenerator.service");
const { deleteFile } = require("../middleware/cleanup.middleware");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assignment/upload
// Accepts a DOCX file, parses bold-headed sections, returns them.
// ─────────────────────────────────────────────────────────────────────────────
const uploadManual = async (req, res) => {
    const filePath = req.file?.path;

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const sections = await parseDocxSections(filePath);

        if (!sections || sections.length === 0) {
            return res.status(422).json({
                error: "No bold-headed sections found in the document. Make sure section titles are fully bold.",
            });
        }

        return res.status(200).json({ sections });
    } catch (err) {
        console.error("[uploadManual]", err);
        return res.status(500).json({ error: "Failed to parse the document." });
    } finally {
        // Always delete uploaded file after processing
        deleteFile(filePath);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assignment/regenerate
// Body: { sectionTitle, experimentName, wordCount }
// Returns: { content: "..." }
// ─────────────────────────────────────────────────────────────────────────────
const regenerateSection = async (req, res) => {
    const { sectionTitle, experimentName, wordCount } = req.body;

    if (!sectionTitle) {
        return res.status(400).json({ error: "sectionTitle is required." });
    }
    if (!experimentName) {
        console.log('ExperimentName is required')
        return res.status(400).json({ error: "experimentName is required." });
    }

    try {
        const content = await generateSectionContent(
            sectionTitle,
            experimentName,
            wordCount || 200,
        );

        return res.status(200).json({ content });
    } catch (err) {
        console.error("FULL ERROR:");
        console.error(err);

        return res.status(500).json({
            error: err.message,
            stack: err.stack,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assignment/generate
// Body: { experimentName, experimentNumber, sections: [...] }
// Returns: DOCX file as download
// ─────────────────────────────────────────────────────────────────────────────
const generateAssignment = async (req, res) => {
    const { experimentName, experimentNumber, sections } = req.body;

    if (!sections || sections.length === 0) {
        return res.status(400).json({ error: "No sections provided." });
    }

    const includedSections = sections.filter((s) => s.included);
    if (includedSections.length === 0) {
        return res
            .status(400)
            .json({ error: "No sections are marked as included." });
    }

    let outputPath = null;

    try {
        outputPath = await generateAssignmentDocx(
            experimentName || "",
            experimentNumber || "",
            sections,
        );

        const filename = path.basename(outputPath);

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );

        const fileStream = fs.createReadStream(outputPath);
        fileStream.pipe(res);

        // Delete the output file once streaming is done
        fileStream.on("end", () => deleteFile(outputPath));
        fileStream.on("error", (err) => {
            console.error("[generateAssignment] Stream error", err);
            deleteFile(outputPath);
        });
    } catch (err) {
        console.error("[generateAssignment]", err);
        if (outputPath) deleteFile(outputPath);
        return res
            .status(500)
            .json({ error: "Failed to generate the assignment document." });
    }
};

module.exports = { uploadManual, regenerateSection, generateAssignment };
