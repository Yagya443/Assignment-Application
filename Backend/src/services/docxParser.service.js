const mammoth = require("mammoth");   //extracts text from .docx

const parseDOCX = async (filePath) => {

    const result =
        await mammoth.extractRawText({
            path: filePath,
        });

    return result.value;
};

module.exports = parseDOCX;