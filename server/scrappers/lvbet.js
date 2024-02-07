import puppeteer from 'puppeteer';
import axios from 'axios';
import { lvbet } from '../config/database.js';

export const getLvbetData = async () => {
    const data = {pageName: lvbet.leagueName, leagues: []};
    try {
        // Setup
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: "new"
        });
        const page = await browser.newPage();
        await page.goto(lvbet.baseUrl);

        // Wyszukanie lig piłki nożnej
        await page.waitForSelector('.ligues-slider__icon.icon.icon-football');
        const leagues = await page.$$('.ligues-slider__icon.icon.icon-football:not(.ligues-slider__item--unavailable > .icon, .sport-container > .icon)');

        if (leagues.length === 0)  {
            console.error('Nie znaleziono lig piłkarskich.');
        }

        // Operacje na ligach
        for (const league of leagues) {
            // Wejście w ligi
            await league.click();
            await new Promise(r => setTimeout(r, 1000));

            // Wydobycie nazwy ligi
            const outputLeagueParent = await page.evaluateHandle(element => element.parentElement, league);
            const outputLeagueSecondChild = await outputLeagueParent.$(':nth-child(2)');
            let outputLeagueName = await page.evaluate(el => el.textContent, outputLeagueSecondChild);
            outputLeagueName = outputLeagueName.trim().replace(/\s/g, '');

            // Zaczytanie wszystkich kategorii
            await page.waitForSelector('.main-stats__item.main-stat.main-stat--open');
            page.hover('.main-markets__more');
            page.hover('.main-markets__hidden-item');
            const categories = await page.$$('.main-markets .cap,.main-markets__more .main-markets__hidden-item');
            let isCategoryFound = false;

            for (let i = 0; i < categories.length; i++) {
                let text = await page.evaluate(el => el.innerText, categories[i]);
                if(text.indexOf("Podania") > -1 ) // Wybór interesującej nas kategorii
                {
                    await categories[i].click();
                    isCategoryFound = true;
                }
            }

            if (!isCategoryFound) {
                // console.log('nie znaleziono kategorii');
                continue;
            }

            await new Promise(r => setTimeout(r, 1000));

            // Wyszukanie meczy
            const matches = await page.$$('.tiered-block__item__top');

            // Operacje na meczach
            const outputMatches = [];
            let requiredPlayers = 0;
            for (const match of matches) {
                // Wejście w mecz
                await match.click();
                await new Promise(r => setTimeout(r, 1000));

                // Informacje o meczu
                let outputMatchName = await match.$('.tiered-block__player-team');
                outputMatchName = await page.evaluate(el => el.textContent, outputMatchName);
                outputMatchName = outputMatchName.trim();
                
                let matchDateAndTime = await match.$('.tiered-block__player-date');
                matchDateAndTime = await page.evaluate(el => el.textContent, matchDateAndTime);
                let [outputMatchDate, outputMatchTime] = matchDateAndTime.split(',');
                outputMatchDate = outputMatchDate.trim();
                outputMatchTime = outputMatchTime.trim();

                // Operacje na zawodnikach
                let countPlayers = 0;
                
                const players = await page.$$('.shots-block__player');

                const outputPlayers = [];
                for (const player of players) {
                    countPlayers++;
                    if (countPlayers <= requiredPlayers) {
                        continue;
                    }
                    const outputRates = {};
                    // Wyciągnięcie nazwy zawodnika
                    const playerName = await player.$('.shots-block__player-name');
                    let outputPlayerName = await page.evaluate(el => el.textContent, playerName);
                    outputPlayerName = outputPlayerName.trim();
                    // Wyciągnięcie kursów zawodnika
                    const rates = await player.$$('.markets-slider__item');
                    // Operacje na kursach
                    for (const rate of rates) {
                        // Wyciągnięcie ilości strzałów
                        const numberOfShots = await rate.$('.markets-slider__amount');
                        let outputNumberOfShots = await page.evaluate(el => el.textContent, numberOfShots);
                        outputNumberOfShots = parseInt(outputNumberOfShots.replace(/\+/g, '').trim());
                        // Wyciągnięcie kursu
                        const finalRate = await rate.$('.markets-slider__stat');
                        let outputFinalRate = await page.evaluate(el => el.textContent, finalRate);
                        outputFinalRate = parseFloat(outputFinalRate);
                        // Dodanie kursów
                        outputRates[outputNumberOfShots] = outputFinalRate;
                    }
                    // Dodanie zawodnika z kursami
                    outputPlayers.push({playerName: outputPlayerName, rates: outputRates});
                }
                // Dodanie meczu
                requiredPlayers += outputPlayers.length;
                outputMatches.push({matchName: outputMatchName, matchDate: outputMatchDate, matchTime: outputMatchTime, players: outputPlayers})
                // console.log(outputPlayers)
            }
            data.leagues.push({leagueName: outputLeagueName, matches: outputMatches});
            const outputData = {leagueName: outputLeagueName, matches: outputMatches};
            sendData(outputData) // generateExcelData - aby generować excela
            // console.log(outputMatches)
        }
        // console.log(lvbet);


        await browser.close();
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

const generateExcelData = (data) => {
    const reutrnData = [];
    for (const match of data.matches) {
        reutrnData.push({playerName: ''});
        reutrnData.push({playerName: match.matchName});
        for (const player of match.players) {
            reutrnData.push({playerName: player.playerName, rates: player.rates})
        }
    }
    console.log(reutrnData);
    sendData({reutrnData});
}

const sendData = (data) => {
    const updatedData = {pageName: lvbet.pageName, data: data};
    axios.post('http://localhost:3001/api', updatedData)
        .then((response) => {
            console.log('Lvbet wysłano ' + data.leagueName);
        })
        .catch((error) => {
            console.error('Błąd podczas wysyłania danych: ' + error);
        });
}