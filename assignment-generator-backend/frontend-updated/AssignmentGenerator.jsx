import { useState } from "react";
import axios from "axios";
import FileUpload from "../Components/FileUpload";
import ExperimentInfo from "../Components/ExperimentInfo";
import SectionCard from "../Components/SectionCard";
import PreviewPanel from "../Components/PreviewPanel";
import FormatSelector from "../Components/FormatSelector";

const AssignmentGenerator = () => {
    const [experimentName, setExperimentName] = useState("");
    const [experimentNumber, setExperimentNumber] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [sections, setSections] = useState([]);
    const [outputFormat, setOutputFormat] = useState("docx");
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!experimentName.trim()) {
            alert("Please enter an Experiment Name.");
            return;
        }
        if (!experimentNumber.trim()) {
            alert("Please enter an Experiment Number.");
            return;
        }
        const included = sections.filter((s) => s.included);
        if (included.length === 0) {
            alert("Please include at least one section.");
            return;
        }

        setGenerating(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/assignment/generate",
                { experimentName, experimentNumber, sections },
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${experimentName || "assignment"}.docx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Failed to generate assignment. Please try again.");
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Assignment Generator
                </h1>

                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <FileUpload
                            setSections={setSections}
                            setUploadedFileName={setUploadedFileName}
                        />

                        <ExperimentInfo
                            experimentName={experimentName}
                            setExperimentName={setExperimentName}
                            experimentNumber={experimentNumber}
                            setExperimentNumber={setExperimentNumber}
                        />

                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Sections</h2>

                            {sections.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-8">
                                    Upload a lab manual to see sections here.
                                </p>
                            )}

                            {sections.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    setSections={setSections}
                                    experimentName={experimentName}
                                />
                            ))}
                        </div>

                        <FormatSelector
                            outputFormat={outputFormat}
                            setOutputFormat={setOutputFormat}
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition"
                        >
                            {generating ? "Generating..." : "Generate & Download"}
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <PreviewPanel
                            experimentName={experimentName}
                            experimentNumber={experimentNumber}
                            sections={sections}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentGenerator;
