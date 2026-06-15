import { useState } from "react";
import FileUpload from "../context/FileUpload";
import ExperimentInfo from "../context/ExperimentInfo";
import SectionCard from "../context/SectionCard";
import PreviewPanel from "../context/PreviewPanel";
import FormatSelector from "../context/FormatSelector";

const AssignmentGenerator = () => {
    const [experimentName, setExperimentName] = useState("");
    const [experimentNumber, setExperimentNumber] = useState("");

    const [sections, setSections] = useState([]);

    const [outputFormat, setOutputFormat] = useState("docx");

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Assignment Generator
                </h1>

                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <FileUpload />

                        <ExperimentInfo
                            experimentName={experimentName}
                            setExperimentName={setExperimentName}
                            experimentNumber={experimentNumber}
                            setExperimentNumber={setExperimentNumber}
                        />

                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">
                                Sections
                            </h2>

                            {sections.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                />
                            ))}
                        </div>

                        <FormatSelector
                            outputFormat={outputFormat}
                            setOutputFormat={setOutputFormat}
                        />
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
