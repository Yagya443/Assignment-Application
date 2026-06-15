const fs = require("fs");   //FILE SYSTEM (USE FOR CREATE,DELETE,RENAME,READ FILES)
const pdf = require("pdf-parse");    //EXTRACTS TEXT FROM PDF DOCUMENTS

const parsePDF = async (filePath) => {
    const buffer = fs.readFileSync(filePath);   // STORES BINATY DATA INSIDE BUFFFER    

    const data = await pdf(buffer); /*
                                      numpages: 5,
                                      metadata: {...},
                                      text: `
                                        Experiment No. 1
                                    */

    return data.text;
};

module.exports = parsePDF;