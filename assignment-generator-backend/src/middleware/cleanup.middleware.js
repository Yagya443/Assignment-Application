const fs = require("fs");

/**
 * Deletes a file from disk silently (no crash if missing).
 */
const deleteFile = (filePath) => {
    if (!filePath) return;
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("[Cleanup] Failed to delete file:", filePath, err.message);
        }
    });
};

module.exports = { deleteFile };
