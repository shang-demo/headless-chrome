module.exports = {
  connections: {
    defaultMongo: {
      hosts: [
        {
          host: '127.0.0.1',
        }
      ],
      database: 'noName',
    },
  },
  bootstrap: ['HeadlessChromeService'],
  chromeEndpoint: 'https://headless-chrome.now.sh',
  // chromeEndpoint: 'https://puppeteer-heroku.herokuapp.com',
};
