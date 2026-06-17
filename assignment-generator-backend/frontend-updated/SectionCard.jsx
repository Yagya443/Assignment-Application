import axios from "axios";

const SectionCard = ({ section, setSections, experimentName }) => {
    const handleWordCountChange = (e) => {
        setSections((prev) =>
            prev.map((item) =>
                item.id === section.id
                    ? { ...item, words: Number(e.target.value) }
                    : item
            )
        );
    };

    const handleContentChange = (e) => {
        setSections((prev) =>
            prev.map((item) =>
                item.id === section.id
                    ? { ...item, content: e.target.value }
                    : item
            )
        );
    };

    const handleRegenerate = async () => {
        setSections((prev) =>
            prev.map((item) =>
                item.id === section.id ? { ...item, loading: true } : item
            )
        );

        try {
            const response = await axios.post(
                "http://localhost:5000/api/assignment/regenerate",
                {
                    sectionTitle: section.title,
                    experimentName: experimentName || "Lab Experiment",
                    wordCount: section.words,
                }
            );

            setSections((prev) =>
                prev.map((item) =>
                    item.id === section.id
                        ? { ...item, content: response.data.content, loading: false }
                        : item
                )
            );
        } catch (error) {
            alert("Failed to regenerate section. Please check your API key and try again.");
            setSections((prev) =>
                prev.map((item) =>
                    item.id === section.id ? { ...item, loading: false } : item
                )
            );
        }
    };

    const handleToggleInclude = () => {
        setSections((prev) =>
            prev.map((item) =>
                item.id === section.id
                    ? { ...item, included: !item.included }
                    : item
            )
        );
    };

    return (
        <div className={`border rounded-xl mb-4 ${!section.included ? "opacity-50" : ""}`}>
            <div className="p-4 flex justify-between items-center">
                <h3 className="font-semibold">{section.title}</h3>
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                        section.included
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                    }`}
                >
                    {section.included ? "Included" : "Excluded"}
                </span>
            </div>

            <div className="p-4 border-t">
                <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <p className="font-bold">Word Count</p>
                        <select
                            value={section.words}
                            onChange={handleWordCountChange}
                            className="border rounded-lg px-2 py-1 w-24"
                        >
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={400}>400</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleRegenerate}
                            disabled={section.loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {section.loading ? "Generating..." : "Regenerate"}
                        </button>

                        <button
                            onClick={handleToggleInclude}
                            className={`px-4 py-2 rounded-lg border font-medium ${
                                section.included
                                    ? "border-red-400 text-red-500 hover:bg-red-50"
                                    : "border-green-500 text-green-600 hover:bg-green-50"
                            }`}
                        >
                            {section.included ? "Exclude" : "Include"}
                        </button>
                    </div>
                </div>

                <textarea
                    rows={8}
                    value={section.content}
                    onChange={handleContentChange}
                    className="w-full border rounded-lg p-3 text-sm"
                />
            </div>
        </div>
    );
};

export default SectionCard;
