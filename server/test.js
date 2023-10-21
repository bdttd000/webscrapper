const kursyGracza1 = {
  "2": 2.5,
  "3": 3.0,
  "4": 4.0,
};
  
const kursyGracza2 = {
  "5": 2.2,
  "6": 3.1,
  "7": 4.1,
};
  
const kursyGracza3 = {
  "4": 2.8,
  "5": 3.3,
  "6": 4.2,
};
  
const kursyGracza4 = {
  "1": 2.7,
  "12": 3.2,
  "15": 4.3,
};

function wyodrebnijLiczbyBramek(kursyGracza1, kursyGracza2, kursyGracza3, kursyGracza4) {
    const liczbyBramek = new Set();
    const kursy = [kursyGracza1, kursyGracza2, kursyGracza3, kursyGracza4];
  
    kursy.forEach((kursyGracza) => {
      Object.keys(kursyGracza).forEach((klucz) => liczbyBramek.add(parseInt(klucz, 10)));
    });
  
    return Array.from(liczbyBramek).sort((a, b) => a - b);
}

function obliczStosunek(kursyGracza1, kursyGracza2, kursyGracza3, kursyGracza4, liczbaBramek) {
  const kursGracza1 = kursyGracza1[`${liczbaBramek}`];
  const kursGracza2 = kursyGracza2[`${liczbaBramek}`];
  const kursGracza3 = kursyGracza3[`${liczbaBramek}`];
  const kursGracza4 = kursyGracza4[`${liczbaBramek}`];

  // Filtruj kursy, usuwając undefined lub nieistniejące kursy
  const kursyDoPorownania = [kursGracza1, kursGracza2, kursGracza3, kursGracza4].filter(Boolean);

  if (kursyDoPorownania.length === 0) {
    // Brak kursów do porównania
    return null;
  }

  const najnizszyKurs = Math.min(...kursyDoPorownania);
  const najwyzszyKurs = Math.max(...kursyDoPorownania);
  const stosunek = najwyzszyKurs / najnizszyKurs;

  return stosunek;
}

const unikalneLiczbyBramek = wyodrebnijLiczbyBramek(kursyGracza1, kursyGracza2, kursyGracza3, kursyGracza4);

const wyniki = {};

unikalneLiczbyBramek.forEach((liczbaBramek) => {
  const stosunki = obliczStosunek(kursyGracza1, kursyGracza2, kursyGracza3, kursyGracza4, liczbaBramek);
  wyniki[`stosunekDla${liczbaBramek}`] = stosunki;
});

console.log(wyniki);