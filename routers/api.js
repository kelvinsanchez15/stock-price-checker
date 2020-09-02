const express = require('express');
const fetch = require('node-fetch');
const Stock = require('../models/stock');

const router = express.Router({ mergeParams: true });

const getStock = async (stock) => {
  const url = `https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${stock}/quote`;
  const fetchResponse = await fetch(url);
  const { symbol, latestPrice } = await fetchResponse.json();

  if (!symbol || !latestPrice) return null;

  return {
    stock: symbol,
    price: latestPrice,
  };
};

const getLikes = async (symbol, like, ip) => {
  let stock;

  stock = await Stock.findOne({ symbol });

  if (!stock) {
    stock = await Stock.create({ symbol });
  }

  if (like !== 'true') return stock.likes.length;

  // Check if ip address already liked the stock
  if (!stock.likes.includes(ip)) {
    stock = await Stock.findOneAndUpdate(
      { symbol },
      { $push: { likes: ip } },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  }

  return stock.likes.length;
};

router.route('/').get(async (req, res) => {
  const { stock, like } = req.query;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (typeof stock === 'string') {
    const stockData = await getStock(stock);

    if (!stockData) return res.json({ error: 'Stock not found' });

    stockData.likes = await getLikes(stock, like, ip);

    return res.json({ stockData });
  }

  const stockData = [await getStock(stock[0]), await getStock(stock[1])];

  if (!stockData[0] || !stockData[1])
    return res.json({ error: 'Stock not found' });

  const likes = [
    await getLikes(stock[0], like, ip),
    await getLikes(stock[1], like, ip),
  ];

  stockData[0].rel_likes = likes[0] - likes[1];
  stockData[1].rel_likes = likes[1] - likes[0];

  return res.json({ stockData });
});

module.exports = router;
