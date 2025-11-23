export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'on',
    launchOptions: {
      args: ['--no-proxy-server']
    }
  },
  reporter: [['list'], ['html']],
};
