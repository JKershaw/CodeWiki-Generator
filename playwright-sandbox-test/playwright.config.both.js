export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'on',
    launchOptions: {
      args: [
        '--no-proxy-server',
        '--proxy-bypass-list=localhost,127.0.0.1',
        '--disable-web-security'
      ]
    }
  },
  reporter: [['list'], ['html']],
};
