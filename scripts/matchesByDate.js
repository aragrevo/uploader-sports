const cheerio = require('cheerio');
const axios = require('axios');

const baseUrl = 'https://apuestas.wplay.co';

function getMatchesByDate(date, sport, array, url) {
  const regExp = /\n/g;
  return axios.get(`${baseUrl}${url}`).then((response) => {
    const $ = cheerio.load(response.data);
    const nextPage = $('.pager-bottom .next a').attr('href');
    const items = $('.time-group')
      .toArray()
      .map((item) => {
        const $item = $(item);
        const time = $item.find('.time').text().replace(regExp, '');
        const events = $item
          .find('.event')
          .toArray()
          .map((event) => {
            const $event = $(event);
            return {
              title: $event.find('span.ev-detail').text().replace(regExp, ''),
              match: $event.find('.title a').text().replace(regExp, ''),
              link: $event.find('.title a').attr('href'),
            };
          });
        return {
          time,
          events,
        };
      });
    array = [...array, ...items];
    if (nextPage) {
      return getMatchesByDate(date, sport, array, nextPage);
    }
    return array;
  });
}

module.exports = { getMatchesByDate };
