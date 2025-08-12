```javascript
const { PrismaClient } = require('@prisma/client');
const request = require('supertest');
const app = require('../index');

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('API Endpoints', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should create a new portfolio', async () => {
    const res = await request(app).post('/api/portfolios').send({ name: 'Test Portfolio' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Portfolio');
  });

  it('should handle portfolio creation error', async () => {
    const res = await request(app).post('/api/portfolios').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Portfolio name is required.');
  });


  it('should get portfolio holdings', async () => {
    const createRes = await request(app).post('/api/portfolios').send({ name: 'Holdings Portfolio' });
    const portfolioId = createRes.body.data.id;
    const holdingsRes = await request(app).get(`/api/portfolios/${portfolioId}/holdings`);
    expect(holdingsRes.status).toBe(200);
    expect(holdingsRes.body.success).toBe(true);
    expect(Array.isArray(holdingsRes.body.data)).toBe(true);
  });

  it('should get portfolio allocation', async () => {
    const createRes = await request(app).post('/api/portfolios').send({ name: 'Allocation Portfolio' });
    const portfolioId = createRes.body.data.id;
    const allocationRes = await request(app).get(`/api/portfolios/${portfolioId}/allocation`);
    expect(allocationRes.status).toBe(200);
    expect(allocationRes.body.success).toBe(true);
    expect(typeof allocationRes.body.data.sectorAllocation).toBe('object');
  });

  it('should get portfolio performance', async () => {
    const createRes = await request(app).post('/api/portfolios').send({ name: 'Performance Portfolio' });
    const portfolioId = createRes.body.data.id;
    const performanceRes = await request(app).get(`/api/portfolios/${portfolioId}/performance`);
    expect(performanceRes.status).toBe(200);
    expect(performanceRes.body.success).toBe(true);
    expect(typeof performanceRes.body.data.totalGainLoss).toBe('number');
  });

  it('should get portfolio summary', async () => {
    const createRes = await request(app).post('/api/portfolios').send({ name: 'Summary Portfolio' });
    const portfolioId = createRes.body.data.id;
    const summaryRes = await request(app).get(`/api/portfolios/${portfolioId}/summary`);
    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.success).toBe(true);
    expect(typeof summaryRes.body.data.summary.totalMarketValue).toBe('number');
  });

  it('should get all portfolios', async () => {
    const res = await request(app).get('/api/portfolios');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create sample data', async () => {
    const res = await request(app).post('/api/seed-data');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.portfolioId).toBe('string');
  });
});
```
