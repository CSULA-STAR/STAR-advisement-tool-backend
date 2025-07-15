const puppeteer = require('puppeteer');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeAssistData(ComCollege, Major) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false
  });

  const page = await browser.newPage();
  await page.goto('https://assist.org/');

  // Fill out search
  await page.waitForSelector('#None-academic-year-select');
  await page.type('#None-academic-year-select', '2024');
  await page.waitForSelector('.ng-option');
  await page.click('.ng-option');

  await page.type('[name="from-institution"]', ComCollege);
  await page.waitForSelector('.option__primary-text');
  await page.click('.option__primary-text');

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

  await page.click('button[type="submit"]');
  await page.waitForSelector('[aria-label="Search for Major"]');
  await page.click('[aria-label="Search for Major"]');
  await page.type('[aria-label="Search for Major"]', Major);
  await page.waitForSelector('.viewByRowColText');
  await page.click('.viewByRowColText');

  // Wait for articulation rows
  await page.waitForSelector('.articRow');

  const results = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.articRow'));
    const output = [];

    rows.forEach(row => {
      const receiving = row.querySelector('.rowReceiving');
      const sending = row.querySelector('.rowSending');

      // CSULA course (receiving)
      const course_code = receiving.querySelector('.prefixCourseNumber')?.innerText.trim();
      const course_name = receiving.querySelector('.courseTitle')?.innerText.trim();
      const creditsRaw = receiving.querySelector('.courseUnits')?.innerText.trim() || '';
      const credits = parseFloat(creditsRaw.split(' ')[0]) || null;

      // PCC courses (sending) — could be multiple
      const equivalent_to = Array.from(sending.querySelectorAll('.prefixCourseNumber')).map(el => el.innerText.trim());
      const equivalent_to_course_name = Array.from(sending.querySelectorAll('.courseTitle')).map(el => el.innerText.trim());

      output.push({
        course_name,
        credits,
        course_code,
        equivalent_to,
        equivalent_to_course_name
      });
    });

    return output;
  });

  await browser.close();
  return results;
}

module.exports = scrapeAssistData;