const puppeteer = require('puppeteer');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeAssistData(ComCollege, Major) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false
  });

  const timeoutDuration = 60000; // 60 seconds
  let timeoutTriggered = false;

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(async () => {
      timeoutTriggered = true;
      await browser.close();
      resolve({
        status: 408,
        message: 'Request Timeout: The operation took too long to complete.'
      });
    }, timeoutDuration);
  });

  const scrapePromise = (async () => {
    try {
      const page = await browser.newPage();
      await page.goto('https://assist.org/');
      await sleep(5000);

      // Fill out search
      await page.waitForSelector('#None-academic-year-select');
      await page.type('#None-academic-year-select', '2024');
      await sleep(5000);
      await page.click('.ng-option');
      await sleep(5000);

      await page.type('[name="from-institution"]', ComCollege);
      await page.waitForSelector('.option__primary-text');
      await sleep(5000);
      await page.click('.option__primary-text');
      await sleep(5000);

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
      await sleep(5000);
      await page.click('.option__primary-text');
      await sleep(5000);

      await page.click('button[type="submit"]');
      await sleep(5000);

      await page.waitForSelector('[aria-label="Search for Major"]');
      await page.click('[aria-label="Search for Major"]');
      await sleep(5000);
      await page.type('[aria-label="Search for Major"]', Major);
      await page.waitForSelector('.viewByRowColText');
      await sleep(5000);
      await page.click('.viewByRowColText');
      await sleep(5000);

      // Wait for articulation rows
      await page.waitForSelector('.articRow');

      const results = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.articRow'));
        const output = [];

        rows.forEach(row => {
          const receiving = row.querySelector('.rowReceiving');
          const sending = row.querySelector('.rowSending');

          const course_code = receiving?.querySelector('.prefixCourseNumber')?.innerText.trim() || null;
          const course_name = receiving?.querySelector('.courseTitle')?.innerText.trim() || null;
          const creditsRaw = receiving?.querySelector('.courseUnits')?.innerText.trim() || '';
          const credits = parseFloat(creditsRaw.split(' ')[0]) || null;

          const equivalent_to = [];
          const equivalent_to_course_name = [];
          const equivalent_to_credits = [];

          const equivalent_courses = Array.from(sending?.querySelectorAll('.courseLine') || []);

          equivalent_courses.forEach(course => {
            const number = course.querySelector('.prefixCourseNumber')?.innerText.trim() || null;
            const title = course.querySelector('.courseTitle')?.innerText.trim() || null;
            const unitsRaw = course.querySelector('.courseUnits')?.innerText.trim() || '';
            const units = parseFloat(unitsRaw.split(' ')[0]) || null;

            equivalent_to.push(number);
            equivalent_to_course_name.push(title);
            equivalent_to_credits.push(units);
          });

          output.push({
            course_code,
            course_name,
            credits,
            equivalent_to,
            equivalent_to_course_name,
            equivalent_to_credits
          });
        });

        return output;
      });

      await browser.close();
      return results;
    } catch (error) {
      if (!timeoutTriggered) {
        await browser.close();
        return {
          status: 500,
          message: 'Internal Server Error: ' + error.message
        };
      }
    }
  })();

  return Promise.race([timeoutPromise, scrapePromise]);
}

module.exports = scrapeAssistData;
