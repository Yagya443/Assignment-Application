const ExperimentInfo = ({
    experimentName,
    setExperimentName,
    experimentNumber,
    setExperimentNumber,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-4">Experiment Details</h2>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">
                        Experiment Number
                    </label>

                    <input
                        type="text"
                        value={experimentNumber}
                        onChange={(e) => setExperimentNumber(e.target.value)}
                        className=" w-full border rounded-lg p-3 "
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Experiment Name
                    </label>

                    <input
                        type="text"
                        value={experimentName}
                        onChange={(e) => setExperimentName(e.target.value)}
                        className=" w-full border rounded-lg p-3 "
                    />
                </div>
            </div>
        </div>
    );
};

export default ExperimentInfo;
