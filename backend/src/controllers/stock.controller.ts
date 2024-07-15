import { Request, Response } from 'express';
import axios from 'axios';
import { sendEmail } from '../service/email.service';
import { getFirestore } from 'firebase-admin/firestore';
const cron = require('node-cron');

// FinnHub JS SDK does not work
const finnhubAPIKey = process.env.FINNHUB_API_KEY;
const polygonAPIKey = process.env.POLYGON_API_KEY;
// Improve: Error Handling
// Improve: Add finnhub and polygon service layer

export const getStockList = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubAPIKey}`
    );
    return res.send({ message: 'Success', data: response.data });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const getStockCandles = async (req: Request, res: Response) => {
  try {
    const { symbol, resolution = 15 } = req.body;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const startTime = startDate.getTime();
    startDate.setHours(23, 0, 0, 0);
    const endTime = startDate.getTime();
    // Note: Finnhub is a paid service for graph, so we are using polygon api
    // const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${apiKey}`)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${resolution}/minute/${startTime}/${endTime}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
    const response = await axios.get(url);
    return res.send({ message: 'Success', data: response.data });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message, data: error.response.data });
  }
};

export const setAlert = async (req: Request, res: Response) => {
  try {
    const { symbol, price, direction } = req.body;
    const { email, uid } = req.authUser;

    const db = getFirestore();

    const alert = await db.collection('alerts').add({
      symbol,
      price,
      direction,
      email,
      user: uid,
    });

    return res.send({ message: 'Alert set successfully' });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message, data: error.response.data });
  }
};

cron.schedule('* * * * *', async () => {
  const db = getFirestore();

  const alerts = await db.collection('alerts').get();

  alerts.forEach((doc) => {
    const alert = doc.data();
    const { symbol, price, direction, email } = alert;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubAPIKey}`;
    axios
      .get(url)
      .then(async (response) => {
        const { c } = response.data;
        if (direction === 'greater' && c > price) {
          await sendEmail(
            email,
            `Alert: ${symbol} price is greater than ${price}`
          );
          await db.collection('alerts').doc(doc.id).delete();
        } else if (direction === 'lesser' && c < price) {
          await sendEmail(
            email,
            `Alert: ${symbol} price is lesser than ${price}`
          );
          await db.collection('alerts').doc(doc.id).delete();
        }
      })
      .catch((error) => {
        console.log('error in cron', error);
      });
  });
});
