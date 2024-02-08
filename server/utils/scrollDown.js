export const scrollDown = async (page, string) => {
    await page.$eval(string, e => {
        e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    });
}