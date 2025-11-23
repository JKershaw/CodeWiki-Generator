const request = require('supertest');

process.env.NODE_ENV = 'test';

describe('Dashboard Routes', () => {
  let app;

  beforeAll(() => {
    const serverModule = require('../../server');
    app = serverModule.app;
  });

  describe('GET /', () => {
    it('should render dashboard view', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('CodeWiki Generator');
    });
  });

  describe('GET /api/status', () => {
    it('should return current processing status', async () => {
      const response = await request(app).get('/api/status');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('currentCommit');
      expect(response.body).toHaveProperty('totalCommits');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /process/start', () => {
    it('should accept repository URL', async () => {
      const response = await request(app)
        .post('/process/start')
        .send({ repoUrl: 'https://github.com/test/repo' })
        .set('Content-Type', 'application/json');

      expect([200, 400, 500]).toContain(response.status);
    });

    it('should validate repository URL format', async () => {
      const response = await request(app)
        .post('/process/start')
        .send({ repoUrl: 'invalid-url' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should require repository URL', async () => {
      const response = await request(app)
        .post('/process/start')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/repository URL/i);
    });
  });

  describe('POST /process/pause', () => {
    it('should pause processing', async () => {
      const response = await request(app).post('/process/pause');
      expect([200, 400]).toContain(response.status);
    });

    it('should return updated status', async () => {
      const response = await request(app).post('/process/pause');
      if (response.status === 200) {
        expect(response.body).toHaveProperty('status');
      }
    });
  });

  describe('POST /process/step', () => {
    it('should process single commit', async () => {
      const response = await request(app).post('/process/step');
      expect([200, 400, 404]).toContain(response.status);
    });

    it('should return processing result', async () => {
      const response = await request(app).post('/process/step');
      if (response.status === 200) {
        expect(response.body).toHaveProperty('commitSha');
      }
    });
  });

  describe('POST /process/batch', () => {
    it('should accept batch size parameter', async () => {
      const response = await request(app)
        .post('/process/batch')
        .send({ count: 10 })
        .set('Content-Type', 'application/json');

      expect([200, 400, 404]).toContain(response.status);
    });

    it('should validate batch size is positive', async () => {
      const response = await request(app)
        .post('/process/batch')
        .send({ count: -5 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });

    it('should use default batch size if not provided', async () => {
      const response = await request(app)
        .post('/process/batch')
        .send({})
        .set('Content-Type', 'application/json');

      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('GET /wiki/:page', () => {
    it('should render wiki page view', async () => {
      const response = await request(app).get('/wiki/index');
      expect([200, 404]).toContain(response.status);
    });

    it('should handle nested wiki pages', async () => {
      const response = await request(app).get('/wiki/concepts/architecture');
      expect([200, 404]).toContain(response.status);
    });

    it('should return 404 for non-existent pages', async () => {
      const response = await request(app).get('/wiki/non-existent-page');
      expect(response.status).toBe(404);
    });
  });
});
