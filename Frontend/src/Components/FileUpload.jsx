

const FileUpload = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upload Lab Manual</h2>

            <label
                className=" border-2 border-dashed rounded-xl h-48 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition ">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                />

                <p className="text-lg font-medium">Drag & Drop File</p>

                <p className="text-gray-500 text-sm">PDF / DOCX Supported</p>
            </label>
        </div>
    );
};

export default FileUpload;
