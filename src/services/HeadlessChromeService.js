const puppeteer = require('puppeteer');

const svc = {
  browser: null,
  async lift() {
    // svc.browser = await puppeteer.launch({
    //   ignoreHTTPSErrors: true,
    //   args: [
    //     // '--proxy-server=socks5://127.0.0.1:1080',
    //     '--disable-gpu',
    //     '--allow-running-insecure-content', // 允许https 执行 http
    //     '--incognito',                       // 以隐身模式启动
    //     '--no-referrers',                    // 不发送 Http-Referer 头
    //     '--mute-audio',
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--remote-debugging-address=0.0.0.0',
    //     '--remote-debugging-port=13833'
    //   ],
    // });
    svc.browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://112.74.107.82:13833/devtools/browser/a4b99cab-8349-43ba-b197-91421ba92dab',
      ignoreHTTPSErrors: true,
    });
    logger.info('start puppeteer.launch');
  },
  async wsEndpoint() {
    const page = await svc.browser.newPage();
    await page.goto('https://www.baidu.com');
    return page.content();
  },
};

module.exports = svc;