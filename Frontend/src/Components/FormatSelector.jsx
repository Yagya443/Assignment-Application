const FormatSelector = ({ outputFormat, setOutputFormat }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Output Format</h2>

            <div className="flex gap-4">
                <button
                    onClick={() => setOutputFormat("docx")}
                    className={` flex-1 p-4 border rounded-xl
                    ${
                        outputFormat === "docx"
                            ? "border-blue-500 bg-blue-50"
                            : ""
                    }
                    `}
                >
                    DOCX
                </button>

                <button
                    onClick={() => setOutputFormat("pdf")}
                    className={` flex-1 p-4 border rounded-xl
                    ${
                        outputFormat === "pdf"
                            ? "border-blue-500 bg-blue-50"
                            : ""
                    }
                    `}
                >
                    PDF
                </button>
            </div>
        </div>
    );
};

export default FormatSelector;
