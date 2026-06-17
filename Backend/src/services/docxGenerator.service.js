const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    VerticalAlign,
    HeadingLevel,
} = require("docx");
const path = require("path");
const fs = require("fs");

const outputDir = path.join(__dirname, "../../outputs");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

/**
 * Builds the final DOCX assignment file.
 *
 * @param {string} experimentName
 * @param {string} experimentNumber
 * @param {Array}  sections  - [{ title, content, included }]
 * @returns {Promise<string>} - absolute path to the generated .docx file
 */
const generateAssignmentDocx = async (experimentName, experimentNumber, sections) => {
    const children = [];

    // ── Title Block ──────────────────────────────────────────────────────────
    if (experimentNumber) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `Experiment ${experimentNumber}`,
                        bold: true,
                        size: 28,
                        font: "Arial",
                    }),
                ],
                spacing: { after: 120 },
            })
        );
    }

    if (experimentName) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: experimentName,
                        bold: true,
                        size: 32,
                        font: "Arial",
                    }),
                ],
                spacing: { after: 480 },
            })
        );
    }

    // ── Sections ─────────────────────────────────────────────────────────────
    const includedSections = sections.filter((s) => s.included);

    for (const section of includedSections) {
        // Section title (bold)
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: section.title,
                        bold: true,
                        size: 26,
                        font: "Arial",
                    }),
                ],
                spacing: { before: 320, after: 120 },
            })
        );

        // Section content (split by newlines to preserve paragraph breaks)
        const paragraphs = section.content
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean);

        for (const para of paragraphs) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: para,
                            size: 24,
                            font: "Arial",
                        }),
                    ],
                    spacing: { after: 160 },
                })
            );
        }
    }

    // ── Marks Table ──────────────────────────────────────────────────────────
    // children.push(...buildMarksTable());

    // ── Build Document ───────────────────────────────────────────────────────
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 24 },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        size: { width: 11906, height: 16838 }, // A4
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                children,
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `assignment_${Date.now()}.docx`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
};

/**
 * Builds a simple Faculty Marks table at the bottom of the document.
 */
// const buildMarksTable = () => {
//     const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
//     const borders = { top: border, bottom: border, left: border, right: border };
//     const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

//     const headerCell = (text) =>
//         new TableCell({
//             borders,
//             margins: cellMargins,
//             shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
//             children: [
//                 new Paragraph({
//                     children: [new TextRun({ text, bold: true, size: 22, font: "Arial" })],
//                     alignment: AlignmentType.CENTER,
//                 }),
//             ],
//         });

//     const dataCell = (text = "") =>
//         new TableCell({
//             borders,
//             margins: cellMargins,
//             children: [
//                 new Paragraph({
//                     children: [new TextRun({ text, size: 22, font: "Arial" })],
//                     alignment: AlignmentType.CENTER,
//                 }),
//             ],
//         });

//     const table = new Table({
//         width: { size: 9026, type: WidthType.DXA },
//         columnWidths: [3008, 3009, 3009],
//         rows: [
//             new TableRow({
//                 children: [
//                     headerCell("Date"),
//                     headerCell("Grade / Marks"),
//                     headerCell("Faculty Signature"),
//                 ],
//             }),
//             new TableRow({
//                 children: [dataCell(), dataCell(), dataCell()],
//             }),
//         ],
//     });

//     return [
//         new Paragraph({ spacing: { before: 600 } }), // spacer before table
//         table,
//     ];
// };

module.exports = { generateAssignmentDocx };
