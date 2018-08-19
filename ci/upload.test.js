// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');

const timeout = 60 * 1000 * 120;
jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;

/** @type {Browser} browser */
let browser;
/** @type {Page} page */
let page;

const getLastReplay = () => {
  return 'demos/F9695E1D4EFDDC44A4994889B74C7E14.replay';
};

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false, userDataDir: './userProfile'});
  page = await browser.newPage();

  await page.goto('https://ballchasing.com/upload');
  await page.setViewport({width: 1600, height: 768});
});

describe('Upload a demo', () => {
  test('Upload latest file.', async () => {
    // Private please.
    const radioSelector ='input[name="visibility"]';
    await page.waitFor(radioSelector, 3000);
    await page.evaluate(`$('${radioSelector}').click();`);

    const uploadInput = await page.$('#replay-upload');
    await uploadInput.uploadFile(getLastReplay());
    // Need to increase timeout above 30s
    await page.waitFor('#lol', 50000);
  });
});

afterAll(async () => {
  await browser.close();
});
