export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'on',
    video: 'retain-on-failure',
    launchOptions: {
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
    }
  },
  reporter: [['list'], ['html']],
};
