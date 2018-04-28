const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const rp = require('request-promise');
const { CronJob } = require('cron');

global.logger = console;

process.env.PORT = 9000;

const svc = {
  browser: null,
  async lift() {
    logger.info('--start puppeteer.launch--');

    let remoteDebuggingAddress = '0.0.0.0';
    if (!process.env.NODE_ENV) {
      remoteDebuggingAddress = '127.0.0.1';
    }
    logger.info('process.env.PORT: ', process.env.PORT);
    logger.info('remoteDebuggingAddress: ', remoteDebuggingAddress);

    try {
      let config = {
        ignoreHTTPSErrors: true,
        headless: true,
        args: [
          // '--proxy-server=socks5://127.0.0.1:1080',
          '--ignore-certificate-errors',
          '--disable-gpu',
          '--allow-running-insecure-content', // 允许https 执行 http
          '--incognito', // 以隐身模式启动
          '--no-referrers', // 不发送 Http-Referer 头
          '--mute-audio',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          `--remote-debugging-address=${remoteDebuggingAddress}`,
          `--remote-debugging-port=${process.env.PORT}`,
        ],
      };

      svc.browser = await puppeteer.launch(config);
      logger.info('wsEndpoint: ', svc.browser.wsEndpoint());
    }
    catch (e) {
      logger.warn(e);
    }
    logger.info('--done puppeteer.launch--');

    // this.closeTagTask();
  },
  async closeTagTask() {
    let options = {
      cronTime: '00 00 02 * * *',
      onTick: async () => {
        await this.closeAllPages();
      },
      timeZone: 'Asia/Shanghai',
      runOnInit: true,
    };

    // eslint-disable-next-line no-new
    new CronJob(options);
  },
  async closeAllPages() {
    let serverUrl = `http://0.0.0.0:${process.env.PORT}`;
    let pageList = await rp({
      url: `${serverUrl}/json/list`,
      method: 'GET',
      json: true,
    });
    logger.info('pageList: ', pageList);
    return Promise.map(pageList, async (pageInfo) => {
      return rp(`${serverUrl}/json/close/${pageInfo.id}`);
    });
  },
};

module.exports = svc;

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('uncaughtException:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit(1);
});


svc.lift();
