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
  bootstrap: [],
  chromeEndpoint: 'http://127.0.0.1:9000',
  // chromeEndpoint: 'https://puppeteer-heroku.herokuapp.com',
};
