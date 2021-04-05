const fs = require('fs');
const { getMatchesByDate } = require('./scripts/matchesByDate');

const baseUrl = 'https://apuestas.wplay.co';

// Ejecución del codigo

const date = new Date().toISOString().split('T')[0];
const sports = ['FOOT', 'TENN', 'CYCL'];

const data = sports.map((sport) => {
  const tmpData = getMatchesByDate(
    date,
    sport,
    [],
    `/es/calendar?date=${date}&sport_code=${sport}`
  );
  return tmpData;
});

Promise.all(data).then((sports) => {
  console.log('finish!');
  const x = sports.flat();
  fs.writeFile(
    './files/matches.json',
    JSON.stringify(x),
    'utf8',
    function (error) {
      if (error) return console.log('error', error);
      console.log(x.length, 'matches saved');
    }
  );
  // });
});
