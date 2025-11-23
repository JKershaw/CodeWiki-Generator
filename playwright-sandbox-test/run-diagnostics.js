import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

// Ensure screenshots directory exists
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

const configurations = [
  {
    name: 'Baseline (no flags)',
    args: []
  },
  {
    name: 'No proxy server',
    args: ['--no-proxy-server']
  },
  {
    name: 'Bypass localhost',
    args: ['--proxy-bypass-list=localhost,127.0.0.1']
  },
  {
    name: 'Combined approach',
    args: ['--no-proxy-server', '--proxy-bypass-list=localhost,127.0.0.1']
  },
  {
    name: 'All flags',
    args: [
      '--no-proxy-server',
      '--proxy-bypass-list=localhost,127.0.0.1',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  }
];

async function testConfiguration(config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${config.name}`);
  console.log(`Args: ${config.args.join(', ') || 'none'}`);
  console.log('='.repeat(60));

  try {
    const browser = await chromium.launch({
      headless: true,
      args: config.args
    });

    const page = await browser.newPage();

    // Try to navigate
    console.log('Attempting navigation to http://localhost:8080...');
    await page.goto('http://localhost:8080', {
      timeout: 10000,
      waitUntil: 'networkidle'
    });

    console.log('✅ Navigation successful!');

    // Try to interact
    console.log('Attempting to click button...');
    await page.click('[data-testid="add-widget"]');
    console.log('✅ Interaction successful!');

    // Take screenshot
    const filename = `screenshots/${config.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`✅ Screenshot saved: ${filename}`);

    // Get page content
    const content = await page.content();
    console.log(`✅ Page content length: ${content.length} characters`);

    await browser.close();

    return {
      success: true,
      config: config.name,
      message: 'All operations completed successfully'
    };

  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return {
      success: false,
      config: config.name,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('PLAYWRIGHT SANDBOX DIAGNOSTIC SUITE');
  console.log('='.repeat(60));

  // Display environment
  console.log('\nEnvironment Variables:');
  console.log(`HTTPS_PROXY: ${process.env.HTTPS_PROXY || 'not set'}`);
  console.log(`HTTP_PROXY: ${process.env.HTTP_PROXY || 'not set'}`);
  console.log(`NO_PROXY: ${process.env.NO_PROXY || 'not set'}`);
  console.log(`CLAUDE_CODE_REMOTE: ${process.env.CLAUDE_CODE_REMOTE || 'not set'}`);

  const results = [];

  for (const config of configurations) {
    const result = await testConfiguration(config);
    results.push(result);

    if (result.success) {
      console.log('\n🎉 SUCCESS! This configuration works!\n');
      break; // Found a working configuration
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const successfulConfigs = results.filter(r => r.success);

  if (successfulConfigs.length > 0) {
    console.log('\n✅ WORKING CONFIGURATIONS:');
    successfulConfigs.forEach(r => {
      console.log(`  - ${r.config}`);
    });
  } else {
    console.log('\n❌ NO CONFIGURATIONS WORKED');
    console.log('\nFailed configurations:');
    results.forEach(r => {
      console.log(`  - ${r.config}: ${r.error}`);
    });
  }

  // Save results
  fs.writeFileSync('diagnostic-results.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to diagnostic-results.json');
}

runAllTests().catch(console.error);
