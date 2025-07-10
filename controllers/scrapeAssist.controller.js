const puppeteer = require('puppeteer');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeAssistData(ComCollege, Major) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false
  });

  const page = await browser.newPage();
  await page.goto('https://assist.org/');

  // Select Academic year
  await page.waitForSelector('#None-academic-year-select', { timeout: 5000 });
  await page.type('#None-academic-year-select', '2024');
  await page.waitForSelector('.ng-option');
  await page.click('.ng-option');

  // Select Community College
  await page.type('[name="from-institution"]', ComCollege);
  await page.waitForSelector('.option__primary-text');
  await page.click('.option__primary-text');

  // Select CSULA
  const selector = '[name="institution-agreement"]';
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return el && !el.disabled && el.offsetParent !== null;
  }, {}, selector);
  const secondField = await page.$(selector);
  await secondField.click({ clickCount: 1 });
  await sleep(500);
  await page.keyboard.type('csula');
  await page.waitForSelector('.option__primary-text');
  await page.click('.option__primary-text');

  // View Agreements
  await page.click('button[type="submit"]');

  // Search by Major
  await page.waitForSelector('[aria-label="Search for Major"]');
  await page.click('[aria-label="Search for Major"]');
  await page.type('[aria-label="Search for Major"]', Major);
  await page.waitForSelector('.viewByRowColText');
  await page.click('.viewByRowColText');

  // Extract info we want using for loop
  await page.waitForSelector('.courseLine', { timeout: 10000 });

  const results = await page.evaluate(() => {
  const sendingRows = Array.from(document.querySelectorAll('.rowSending .courseLine'));
  const receivingRows = Array.from(document.querySelectorAll('.rowReceiving .courseLine'));

  const results = [];
  const numPairs = Math.min(sendingRows.length, receivingRows.length);

  for (let i = 0; i < numPairs; i++) {
    const left = sendingRows[i];
    const right = receivingRows[i];

    const course_name = left.querySelector('.courseTitle')?.innerText.trim() || '';
    const creditsRaw = left.querySelector('.courseUnits')?.innerText.trim() || '';
    const credits = parseFloat(creditsRaw.split(' ')[0]) || null;

    const equivalent_to = Array.from(right.querySelectorAll('.prefixCourseNumber')).map(el => el.innerText.trim());
    const equivalent_to_course_name = Array.from(right.querySelectorAll('.courseTitle')).map(el => el.innerText.trim());

    results.push({
      course_name,
      credits,
      equivalent_to,
      equivalent_to_course_name
    });
  }

  return results;
});




  await browser.close();
  return results;
}

module.exports = scrapeAssistData;