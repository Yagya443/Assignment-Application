const parsePDF = require("../services/pdfParser.service");
const parseDOCX = require("../services/docxParser.service");
const detectSections = require("../services/sectionDetector.service");

const uploadAssignment = async (req, res) => {
    try {
        const file = req.file;

        let text = "";

        if (file.mimetype === "application/pdf") {
            text = await parsePDF(file.path);
        } else {
            text = await parseDOCX(file.path);
        }

        const sections = detectSections(text);

        return res.json({
            sections,
            rawText: text,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = uploadAssignment;
