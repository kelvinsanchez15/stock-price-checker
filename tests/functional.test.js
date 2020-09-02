const mongoose = require('mongoose');
const request = require('supertest');
const Stock = require('../models/stock');
const app = require('../app');

beforeAll(async () => {
  await Stock.deleteMany();
});

afterAll(async () => {
  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close();
});

describe('Functional Tests', () => {
  describe('GET /api/stock-prices => stockData object', () => {
    test('1 stock', async () => {
      const response = await request(app)
        .get('/api/stock-prices')
        .query({ stock: 'goog' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stockData');
      expect(response.body).toHaveProperty('stockData.stock');
      expect(response.body).toHaveProperty('stockData.price');
      expect(response.body).toHaveProperty('stockData.likes');
    });

    test('1 stock with like', async () => {
      const response = await request(app)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stockData');
      expect(response.body).toHaveProperty('stockData.stock');
      expect(response.body).toHaveProperty('stockData.price');
      expect(response.body).toHaveProperty('stockData.likes', 1);
    });

    test('1 stock with like again (ensure likes arent double counted)', async () => {
      const response = await request(app)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stockData');
      expect(response.body).toHaveProperty('stockData.stock');
      expect(response.body).toHaveProperty('stockData.price');
      expect(response.body).toHaveProperty('stockData.likes', 1);
    });

    test('2 stocks', async () => {
      const response = await request(app)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'] });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stockData');
      expect(response.body.stockData[0]).toHaveProperty('stock', 'GOOG');
      expect(response.body.stockData[0]).toHaveProperty('price');
      expect(response.body.stockData[0]).toHaveProperty('rel_likes');
      expect(response.body.stockData[1]).toHaveProperty('stock', 'MSFT');
      expect(response.body.stockData[1]).toHaveProperty('price');
      expect(response.body.stockData[1]).toHaveProperty('rel_likes');
    });

    test('2 stocks with like', async () => {
      const response = await request(app)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'], like: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stockData');
      expect(response.body.stockData[0]).toHaveProperty('stock', 'GOOG');
      expect(response.body.stockData[0]).toHaveProperty('price');
      expect(response.body.stockData[0]).toHaveProperty('rel_likes', 0);
      expect(response.body.stockData[1]).toHaveProperty('stock', 'MSFT');
      expect(response.body.stockData[1]).toHaveProperty('price');
      expect(response.body.stockData[1]).toHaveProperty('rel_likes', 0);
    });
  });
});
