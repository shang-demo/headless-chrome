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
  rabbitmq: {
    username: '',
    password: '',
    host: '127.0.0.1',
    port: '',
    reconnectDelay: 0,
  },
  bootstrap: [],
  chromeEndpoint: 'http://127.0.0.1:9000',
  // chromeEndpoint: 'https://puppeteer-heroku.herokuapp.com',
};
