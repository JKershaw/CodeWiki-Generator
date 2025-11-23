import { chromium } from 'playwright';

async function debugChromium() {
  console.log('Attempting to launch Chromium with debugging...');

  try {
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ]
    });

    console.log('✅ Browser launched successfully!');

    const page = await browser.newPage();
    console.log('✅ Page created successfully!');

    console.log('Attempting to navigate to localhost:8080...');
    await page.goto('http://localhost:8080', {
      timeout: 10000
    });

    console.log('✅ Navigation successful!');

    const title = await page.title();
    console.log(`Page title: ${title}`);

    await page.screenshot({ path: 'screenshots/debug-success.png' });
    console.log('✅ Screenshot saved!');

    await browser.close();
    console.log('✅ Browser closed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugChromium();
