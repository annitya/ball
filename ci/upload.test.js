// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');
const {statSync, readdirSync} = require('fs');

const timeout = 60 * 1000 * 120;
jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;

const sourceDirectory = 'demos';
const fileCount = () => readdirSync(sourceDirectory).length;
// const sourceDirectory = 'demos';

let currentCount = fileCount();

/** @type {Browser} browser */
let browser;
/** @type {Page} page */
let page;

const getLastReplay = () => {
  const files = readdirSync(sourceDirectory).sort((a, b) => {
    return statSync(`${sourceDirectory}/${b}`).mtime.getTime() - statSync(`${sourceDirectory}/${a}`).mtime.getTime();
  });

  return `${sourceDirectory}/${files[0]}`
};
getLastReplay();

const monitorShare = async (callback) => {
  const count = fileCount();

  console.log(`Current: ${currentCount}. New: ${count}`);

  if (count !== currentCount) {
    await callback();
    currentCount = count;
  }

  setTimeout(() => monitorShare(callback), 5000);
};

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false, userDataDir: './userProfile'});
  page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1200});

});

doUpload = async () => {
  // Private please.
  await page.goto('https://ballchasing.com/upload');
  const radioSelector ='input[name="visibility"]';
  await page.waitFor(radioSelector, 3000);
  await page.evaluate(`$('${radioSelector}').click();`);

  const uploadInput = await page.$('#replay-upload');
  await uploadInput.uploadFile(getLastReplay());

  // Upload success.
  await page.$('i.has-text-success');

  const newReplayPage = await browser.newPage();
  await newReplayPage.setViewport({width: 1920, height: 1200});
  await newReplayPage.goto('https://ballchasing.com/?w=mine');

  const firstReplaySelector = 'ul li a';
  await newReplayPage.waitForSelector(firstReplaySelector);
  await newReplayPage.click(firstReplaySelector);
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
