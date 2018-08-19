// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');
const {watch, statSync, readdirSync} = require('fs');
const max = require ('lodash.max');

const timeout = 60 * 1000 * 120;
jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
const fileCount = () => readdirSync('./demos').length;

let currentCount = fileCount();

/** @type {Browser} browser */
let browser;
/** @type {Page} page */
let page;


const getLastReplay = () => {
  const files = readdirSync('./demos');

  const latest = max(files, (f) => {
    const fullpath = path.join(dir, f);
    return statSync(fullpath).ctime;
  });

  return `demos/${latest}`
};

const monitorShare = async (callback) => {
  const count = fileCount();

  console.log(`Current: ${currentCount}`);
  console.log(`New; ${count}`);

  if (count !== currentCount) {
    await callback();
    currentCount = count;
  }

  setTimeout(() => monitorShare(callback), 5000);
};

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false, userDataDir: './userProfile'});
  page = await browser.newPage();
  await page.setViewport({width: 1600, height: 768});

});

doUpload = async () => {
  // Private please.
  await page.goto('https://ballchasing.com/upload');
  const radioSelector ='input[name="visibility"]';
  await page.waitFor(radioSelector, 3000);
  await page.evaluate(`$('${radioSelector}').click();`);

  const uploadInput = await page.$('#replay-upload');
  await uploadInput.uploadFile(getLastReplay());
  // Need to increase timeout above 30s
};

describe('Upload new demos', () => {
  test('Start watcher', async () => {
    await monitorShare(doUpload);
    await page.waitFor('#lol', {timeout});
  });
});

afterAll(async () => {
  await browser.close();
});
