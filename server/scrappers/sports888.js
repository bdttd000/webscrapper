import puppeteer from 'puppeteer';
import { _sports888 } from '../config/config.js';
import { scrollDown, loadPageContent } from '../utils/scrollingMethods.js';
import { formatTime, monthTranslator } from '../utils/timeTranslators.js';
import { extractTensFromText } from '../utils/extractTensFromText.js';
import { sendData } from '../utils/dataReceiver.js';
import { normalizeLeagueName } from '../utils/leagueMappings.js';

export const getSports888Data = async () => {
    if (_sports888.leagueNames.length < 1) {
        return
    }

    const data = {pageName: _sports888.pageName, leagues: []};
    try {
        // Setup i włączenie strony ze zmienionym viewportem
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            // headless: "new", // Procesy będą wykonywały się w tle
            headless: false // Procesy będą widoczne w nowej przeglądarce
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080});
        await page.goto(_sports888.baseUrl);

        // Przejście do meczy piłki nożnej 
        await page.locator("[href='#football']").click();
        await new Promise(r => setTimeout(r, 3000));

        // Przypisanie przycisków z datami do zmiennej
        const buttons = await page.$$('.carousel.matchesCarousel .carousel__item');
        for (const button of buttons) {
            // Sprawdzenie czy mamy jeszcze jakieś interesujące nas ligi
            if (_sports888.leagueNames.length === 0) {
                break;
            }

            // Wykluczamy wyniki live i dzisiejsze
            let buttonName = await page.evaluate(el => el.textContent, button);
            if (buttonName === 'Live' || buttonName === 'Today') continue;

            // Przechodzimy do kolejnego dnia
            await button.click();
            await scrollDown(page, '.carousel__item');
            
            // Wyszukanie wszystkich nazw lig, które się odbywają w danym dniu
            await page.locator(".bb-content-section__title--see-more");

            // Funkcja scrollująca stronę w celu załadowania dynamicznego contentu
            await loadPageContent(page, '.carousel__item');

            // Przypisanie nagłówków lig do zmiennej
            const leagues = await page.$$('.bb-content-section__title--see-more');
            for (const league of leagues) {
                // Sprawdzenie czy dana liga nas interesuje, jeśli tak to usuwamy ją z naszej listy
                if (!_sports888.leagueNames) {
                    break;
                }
                let leagueName = await page.evaluate(el => el.textContent, league);
                if (!_sports888.leagueNames.includes(leagueName)) continue;
                const outputLeague = {leagueName: '', matches: []};
                outputLeague.leagueName = normalizeLeagueName(leagueName);
                _sports888.leagueNames = _sports888.leagueNames.filter(requiredLeagues => requiredLeagues !== leagueName);

                // Otwieramy naszą ligę w nowej karcie
                const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
                await league.click({button: 'middle'});
                const leaguePage = await newPagePromise;
                await leaguePage.setViewport({ width: 1920, height: 1080});

                // Przechodzimy na stronę danej ligi
                await leaguePage.bringToFront();  

                // Funkcja scrollująca stronę w celu załadowania dynamicznego contentu
                await loadPageContent(page, '.h1-bar__title');

                // Stworzenie tabeli do przechowywania informacji o meczach w lidze
                const outputMatches = [];

                // Przypisanie do zmiennej wszyskich meczy
                const matches = await leaguePage.$$('a.event-description:not(.event-description--inplay)');
                for (const match of matches) {
                    // Stworzenie zmiennej przechowującej dane o danym meczu
                    const outputMatch = {};

                    // Otwieramy naszą kartę z meczem w nowej karcie
                    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
                    await match.click({button: 'middle'});
                    const matchPage = await newPagePromise;
                    await matchPage.setViewport({ width: 1920, height: 1080});

                    // Przechodzimy na stronę danego meczu
                    await matchPage.bringToFront();  

                    // Zaczytujemy pola z nazwami druzyn i zapisujemy je do naszego obiektu
                    await matchPage.waitForSelector(".PreplayScoreboard__team-name-text.PreplayScoreboard__team-name-text--image");
                    const teams = await matchPage.$$('.PreplayScoreboard__team-name-text.PreplayScoreboard__team-name-text--image');
                    let team1 = await matchPage.evaluate(el => el.textContent, teams[0]);
                    let team2 = await matchPage.evaluate(el => el.textContent, teams[1]);
                    outputMatch.matchName = `${team1} vs ${team2}`;

                    // Zaczytujemy pole z datą naszego meczu i zapiujemy ją do naszego obiektu
                    await matchPage.waitForSelector("time");
                    const matchTimeData = await matchPage.$$("time");
                    let matchTimeHour = await matchPage.evaluate(el => el.textContent, matchTimeData[0]);
                    let matchTimeDayInfo = await matchPage.evaluate(el => el.textContent, matchTimeData[1]);
                    matchTimeDayInfo = matchTimeDayInfo.split(',')[1].trim();
                    let [matchTimeMonth, matchTimeDay] = matchTimeDayInfo.split(' ')
                    outputMatch.matchDate = `${matchTimeDay}-${monthTranslator(matchTimeMonth)}`;
                    outputMatch.matchTime = formatTime(matchTimeHour);
                    outputMatch.players = [];

                    // Utworzenie obiektu zbierającego informacje o zawodnikach
                    const players = {};

                    // Wydobycie nazwy nagłówków zakładów, chcemy żeby zawierał frazę "OR MORE PASSES"
                    await matchPage.waitForSelector(".PreplayMarkets");
                    const bets = await matchPage.$$('.PreplayMarkets');
                    for (const bet of bets) {
                        await bet.waitForSelector(".PreplayMarkets__heading");
                        const heading = await bet.$(".PreplayMarkets__heading > span:nth-of-type(1)");
                        let headingContent = await matchPage.evaluate(el => el.textContent, heading);
                        if (!headingContent.toLowerCase().includes('or more passes')) {
                            continue;
                        }

                        // Zaczytanie dokładnej liczby podań
                        const numberOfPasses = extractTensFromText(headingContent)

                        // Zaczytanie listy z betami
                        heading.click();

                        // TODO
                        // Rozwinięcie listy jeśli jest taka możliwość
                        // const showMoreButton = bet.$('.show-more__collapse');
                        // if (showMoreButton) showMoreButton.click();

                        await bet.waitForSelector("li");
                        const betRows = await bet.$$('li');

                        // Pętla do wydobycia informacji o każdym zakładzie
                        for (const betRow of betRows) {
                            // Zdobycie danych piłkarza i kursu zakładu
                            await betRow.waitForSelector(".selection_name > span");
                            let playerNameAndRates = await betRow.$('.selection_name > span');
                            playerNameAndRates = await betRow.evaluate(el => el.textContent, playerNameAndRates);

                            // Rozbijanie danych na dane zawodnika i jego kurs
                            const playerName = playerNameAndRates.match(/^[^\d]+/)[0].trim();
                            let rates = playerNameAndRates.match(/\d+\/\d+/)[0].trim();
                            rates = Math.round((1 + parseFloat(eval(rates))) * 100) / 100;

                            // Dodanie danych do obiektu // koniec
                            if (!players[playerName]) {
                                players[playerName] = { playerName: playerName, rates: {} };
                            }

                            players[playerName].rates[numberOfPasses] = rates;
                        }
                    }

                    // Dodanie informacji o zawodnikach do zmiennej outputMatch
                    Object.values(players).forEach(playerInfo => {
                        outputMatch.players.push(playerInfo);
                    });

                    // Dodanie meczu do ligi tylko jeśli są jakiekolwiek kursy zawodników
                    if (outputMatch.players.length > 0) {
                        outputMatches.push(outputMatch);
                    }

                    console.log(outputMatch)

                    // Zamykamy kartę
                    await leaguePage.bringToFront();  
                    await matchPage.close();   

                }

                // Dodanie meczy do ligi
                if (outputMatches.length > 0) {
                    outputLeague.matches = outputMatches;
                }

                console.log(outputMatches)

                // Zamykamy kartę
                await page.bringToFront();  
                await leaguePage.close();    
                
                console.log(outputLeague);

                // Dodanie ligi do ostatecznego api
                if (outputLeague.matches.length > 0) {
                    data.leagues.push(outputLeague);
                }
            }            
        }

        console.log(data);

        await browser.close();

        // Wysłanie danych do bazy danych
        data.leagues.forEach(leagueInfo => {
            sendData({pageName: data.pageName, leagues: leagueInfo});
        });
        
    
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

