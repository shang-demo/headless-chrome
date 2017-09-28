const puppeteer = require('puppeteer');
const rp = require('request-promise');

const svc = {
  browser: null,
  async lift() {
    this.browser = await this.connect(mKoa.config.chromeEndpoint);
    logger.info('success puppeteer.connect');
  },
  async getBrowser() {
    return this.browser;
  },
  async connect(chromeEndpoint) {
    let body = await rp({
      method: 'GET',
      url: `${chromeEndpoint}/json/version`,
      json: true,
    });

    return puppeteer.connect({
      browserWSEndpoint: body.webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
    });
  },
  async reconnect() {
    await this.lift();
    return this.wsEndpoint();
  },
  async wsEndpoint() {
    return this.browser.wsEndpoint();
  },
  async pageContent({ url, delay }) {
    let page;
    try {
      let browser = await this.getBrowser();
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
