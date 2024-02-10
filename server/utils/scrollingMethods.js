// Funkcja zjeżdżająca na sam dół strony
const scrollDown = async (page, string) => {
    await page.$eval(string, e => {
        e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    });
}

// Funkcja scrollująca po całej stronie, używana w przypadku dynamicznego kontentu strony
const loadPageContent = async (page, startingELement) => {
    await new Promise(r => setTimeout(r, 1000));
    await scrollDown(page, '#footer');
    await new Promise(r => setTimeout(r, 1000));
    await scrollDown(page, startingELement);
    await new Promise(r => setTimeout(r, 1000));
    await scrollDown(page, '#footer');
    await new Promise(r => setTimeout(r, 4000));
}

export {scrollDown, loadPageContent}