const detectSections = (text) => {

    const sectionNames = [
        "Learning Objective",
        "Theory",
        "Algorithm",
        "Implementation",
        "Output",
        "Viva Question",
        "Learning Outcomes",
        "Result and Discussion",
        "Conclusion",
    ];

    const sections = [];

    sectionNames.forEach((name) => {

        const regex =
            new RegExp(`${name}:?(.*?)(?=\\n[A-Z]|$)`, "is");

        const match = text.toLowerCase().match(regex);

        sections.push({
            title: name,
            content: match
                ? match[1].trim()
                : "",
        });
    });

    return sections;
};

module.exports = detectSections;