const puppeteer = require('puppeteer');
const rp = require('request-promise');
const promiseRetry = require('promise-retry');

const svc = {
  browser: null,
  async connect(chromeEndpoint) {
    let body = await rp({
      method: 'GET',
      url: `${chromeEndpoint}/json/version`,
      json: true,
    });

    if (/^https/.test(chromeEndpoint)) {
      body.webSocketDebuggerUrl = body.webSocketDebuggerUrl.replace(/^ws:\/\//, 'wss://');
    }
    return puppeteer.connect({
      browserWSEndpoint: body.webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
    });
  },
  async tryPage({ url, delay }) {
    return promiseRetry((retry, number) => {
      logger.warn('attempt number', number, url, delay);
      return svc.pageContent({ url, delay });
    }, { retries: 3, factor: 1 });
  },
  async pageContent({ url, delay }) {
    let browser = await this.connect(mKoa.config.chromeEndpoint);
    let page;
    try {
      page = await browser.newPage();
      await page.goto(url);
      if (delay) {
        await Promise.delay(delay);
      }
      let html = await page.$eval('html', (e) => {
        return e.outerHTML;
      });
      await page.close();
      return html;
    }
    catch (e) {
      logger.warn(e);
      if (page && page.close) {
        await page.close();
      }
      return Promise.reject(new Errors.PageContentError({
        originMsg: e.message,
      }));
    }
  },
};

module.exports = svc;
