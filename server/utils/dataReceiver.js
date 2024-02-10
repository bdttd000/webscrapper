import axios from 'axios';

// Funkcja generująca dane do excela
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

// Funkcja wysyłająca dane do bazy
const sendData = (data) => {
    axios.post('http://localhost:3001/api', data)
        .then((response) => {
            console.log('Lvbet wysłano ' + data.leagueName);
        })
        .catch((error) => {
            console.error('Błąd podczas wysyłania danych: ' + error);
        });
}

export {generateExcelData, sendData}