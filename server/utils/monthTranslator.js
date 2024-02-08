export const monthTranslator = (month) => {
    const monthNamesEnglish = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december",
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const monthNamesPolish = [
        "sty", "lut", "mar", "kwi", "maj", "cze",
        "lip", "sie", "wrz", "paź", "lis", "gru"
    ];

    const index = monthNamesEnglish.findIndex(name => name.toLowerCase() === month.toLowerCase());
    if (index !== -1) {
        return monthNamesPolish[index % 12];
    }

    return null;
}