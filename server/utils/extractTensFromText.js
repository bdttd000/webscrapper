// Funkcja do wyciągania nazw dziesiątek z tekstu i konwertowania ich do zmiennej liczbowej
export const extractTensFromText = (text) => {
    const tens = {
        "Ten": 10, "Twenty": 20, "Thirty": 30, "Forty": 40, "Fifty": 50,
        "Sixty": 60, "Seventy": 70, "Eighty": 80, "Ninety": 90
    };

    const numberInText = text.match(/\b(?:Ten|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety)\b/i);

    if (numberInText) {
        return tens[numberInText[0]];
    } else {
        console.log("Number not found in the text.");
    }

    return 0;
}