const MONGODB_DATABASE = 'production';
const MONGODB_USERNAME = 'productionUser';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

module.exports = {
  log: {
    level: 'trace',
    requestBody: true,
    responseBody: false,
  },
  connections: {
    defaultMongo: {
      username: MONGODB_USERNAME,
      password: MONGODB_PASSWORD,
      hosts: [
        {
          host: '112.74.107.82',
          port: 13508,
        }
      ],
      database: MONGODB_DATABASE,
    },
  },
  port: process.env.PORT || 8080,
  graphql: {
    graphiql: true,
  },
  ip: undefined,
  bootstrap: [],
  chromeEndpoint: 'https://puppeteer-heroku.herokuapp.com',
};
