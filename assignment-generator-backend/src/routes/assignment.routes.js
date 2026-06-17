const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload.middleware");
const {
    uploadManual,
    regenerateSection,
    generateAssignment,
} = require("../controllers/assignment.controller");

// POST /api/assignment/upload  → parse DOCX, return sections
router.post("/upload", upload.single("file"), uploadManual);

// POST /api/assignment/regenerate  → Gemini regenerates one section
router.post("/regenerate", regenerateSection);

// POST /api/assignment/generate  → build + download final DOCX
router.post("/generate", generateAssignment);

module.exports = router;
