// Funkcja do zmiany formatu z porą dnia do samej godziny
// Przykład 
// Konwertuje "2:34pm" into "12:34"
const formatTime = (time) => {
    let [hours, minutes, meridiem] = [...time.slice(0, -2).split(':'), time.slice(-2)];
    hours = meridiem.toLowerCase() === 'pm' ? +hours + 12 : hours;
    return `${hours}:${minutes}`;
}

// Funkcja zmieniająca angielską nazwę miesiąca pełną lub skrót na polski skrót
// Przykład 
// Konwertuje "july" / "jul" into "lip"
const monthTranslator = (month) => {
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

export {formatTime, monthTranslator}