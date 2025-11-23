export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  reporter: [['list'], ['html']],
};
