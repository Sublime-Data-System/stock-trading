
import { Request, Response } from 'express';
import axios from 'axios';
import { sendEmail } from '../service/email.service';
const cron = require('node-cron');

// FinnHub JS SDK does not work
const finnhubAPIKey = process.env.FINNHUB_API_KEY;
const polygonAPIKey = process.env.POLYGON_API_KEY
const alertMap = new Map();
// Improve: Error Handling
// Improve: Add finnhub and polygon service layer

export const getStockList = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubAPIKey}`);
    return res.send({ message: "Success", data: response.data });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

export const getStockCandles = async (req: Request, res: Response) => {
  try {
    const { symbol, resolution = 15 } = req.body;
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0);
    const startTime = startDate.getTime();
    startDate.setHours(23, 0, 0, 0)
    const endTime = startDate.getTime();
    // Note: Finnhub is a paid service for graph, so we are using polygon api
    // const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${apiKey}`)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${resolution}/minute/${startTime}/${endTime}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
    const response = await axios.get(url)
    return res.send({ message: "Success", data: response.data });
  } catch (error) {
    return res.status(500).send({ message: error.message, data: error.response.data });
  }
}

export const setAlert = async (req: Request, res: Response) => {
  try {
    // TODO: Get the email from the auth middleware instead of the request body
    const { symbol, price, direction, email } = req.body;
    alertMap.set(`${symbol} ${email}`, { price, direction });
    return res.send({ message: "Alert set successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message, data: error.response.data });
  }
}


// cron.schedule('*/5 * * * *', () => {
cron.schedule('* * * * *', () => {
  alertMap.forEach((value, key) => {
    const { price, direction } = value;
    const [symbol, email] = key.split(' ');
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubAPIKey}`;
    axios.get(url).then(async (response) => {
      const { c } = response.data;
      if (direction === 'greater' && c > price) {
        await sendEmail(email, `Alert: ${symbol} price is greater than ${price}`);
        alertMap.delete(key);
      } else if (direction === 'lesser' && c < price) {
        await sendEmail(email, `Alert: ${symbol} price is lesser than ${price}`);
        alertMap.delete(key);
      }
    }).catch((error) => {
      console.log("error in cron", error);
    });
  })
});


