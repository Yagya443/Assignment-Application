import { useState } from "react";

const SectionCard = ({ section }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="border rounded-xl mb-4">
            <div
                onClick={() => setOpen(!open)}
                className="p-4 flex justify-between items-center cursor-pointer"
            >
                <h3 className="font-semibold">{section.title}</h3>

                <span>{open ? "▲" : "▼"}</span>
            </div>

            {open && (
                <div className="p-4 border-t">
                    <div className="flex justify-between mb-3">
                        <input
                            type="number"
                            value={section.words}
                            className=" border rounded-lg p-2 w-24"
                        />

                        <button className=" bg-blue-500 text-white px-4 py-2 rounded-lg ">
                            Regenerate
                        </button>
                    </div>

                    <textarea
                        rows={8}
                        value={section.content}
                        className=" w-full border rounded-lg p-3 "
                    />
                </div>
            )}
        </div>
    );
};

export default SectionCard;
