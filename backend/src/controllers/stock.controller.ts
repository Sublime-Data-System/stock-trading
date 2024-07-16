import { Request, Response } from 'express';
import { sendEmail } from '../service/email.service';
import { getFirestore } from 'firebase-admin/firestore';
import {
  getStocks,
  getCandles,
  getStockPrice,
} from '../service/stocks.service';
const cron = require('node-cron');
import moment from 'moment-timezone';

export const getStockList = async (req: Request, res: Response) => {
  try {
    const stocks = await getStocks();
    return res.send({ message: 'Success', data: stocks });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

export const getStockCandles = async (req: Request, res: Response) => {
  try {
    const { symbol, resolution = 15 } = req.body;
    
    const startDate = new Date();
    // Note: Free plan doesn't allow fetching present day data
    startDate.setDate(startDate.getDate() - 1);
    const day = startDate.getDay();
    
    // checking for market day
    if (day > 5) {
      startDate.setDate(startDate.getDate() - 1);
    }
    if (day < 1) {
      startDate.setDate(startDate.getDate() - 2);
    }

    const startTime = moment(startDate).tz('America/New_York').startOf('day').unix() * 1000;
    const endTime = moment(startDate).tz('America/New_York').endOf('day').unix() * 1000;

    const candles = await getCandles(symbol, resolution, startTime, endTime);

    return res.send({ message: 'Success', data: candles });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res
      .status(500)
      .send({ message: error.message, data: error.response.data });
  }
};

cron.schedule('* * * * *', async () => {
  try {
    const db = getFirestore();

    const alerts = await db.collection('alerts').get();

    alerts.forEach(async (doc) => {
      const alert = doc.data();
      const { symbol, price, direction, email } = alert;

      const { c } = await getStockPrice(symbol);

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
    });
  } catch (error) {
    console.log('Error in cron job: ', error);
  }
});
