const PreviewPanel = ({ experimentName, experimentNumber, sections }) => {
    return (
        <div className=" bg-white rounded-xl shadow-sm p-5 sticky top-5 border-2">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

            <div className="space-y-6">
                <div className="">
                    <h3 className="text-center font-bold">
                        Experiment {experimentNumber} - {experimentName}
                    </h3>
                </div>

                {sections.map((section) => (
                    <div key={section.id}>
                        <h4 className="font-bold mb-2">{section.title}</h4>

                        <p className="text-sm">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviewPanel;
