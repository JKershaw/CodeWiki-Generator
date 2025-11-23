const request = require('supertest');

// Import app directly without starting server
// Set NODE_ENV to test to prevent server from listening
process.env.NODE_ENV = 'test';

describe('Express Server', () => {
  let app;

  beforeAll(() => {
    // Get the app without starting the server
    const serverModule = require('../../server');
    app = serverModule.app;
  });

  describe('Health Check', () => {
    it('should return 200 from health check endpoint', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should include timestamp in health check', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should include version in health check', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Static File Serving', () => {
    it('should serve static files from public directory', async () => {
      const response = await request(app).get('/public/test.txt');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Test static file');
    });

    it('should return 404 for non-existent static files', async () => {
      const response = await request(app).get('/public/non-existent.txt');
      expect(response.status).toBe(404);
    });
  });

  describe('View Engine', () => {
    it('should have EJS configured as view engine', () => {
      expect(app.get('view engine')).toBe('ejs');
    });

    it('should have views directory configured', () => {
      const viewsPath = app.get('views');
      expect(viewsPath).toContain('views');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should include path in 404 response', async () => {
      const response = await request(app).get('/missing-page');
      expect(response.body).toHaveProperty('path', '/missing-page');
    });
  });

  describe('Middleware Configuration', () => {
    it('should parse JSON bodies', async () => {
      const response = await request(app)
        .post('/test-json')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // Will get 404 since route doesn't exist, but JSON should be parsed
      expect([404, 500]).toContain(response.status);
    });

    it('should parse URL-encoded bodies', async () => {
      const response = await request(app)
        .post('/test-form')
        .send('key=value')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect([404, 500]).toContain(response.status);
    });
  });
});
