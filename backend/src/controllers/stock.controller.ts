
import { Request, Response } from 'express';
import axios from 'axios';
const apiKey = process.env.FINNHUB_API_KEY;
const polygonAPIKey = process.env.POLYGON_API_KEY
// FinnHub JS SDK does not work
// const finnhub = require('finnhub');
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = process.env.FINNHUB_API_KEY;
// const finnhubClient = new finnhub.DefaultApi()


export const getStockList = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
    console.log("response", response.data.length);
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
    console.log('startTime = ', startTime);
    console.log('endTime = ', endTime);
    // Note: Finnhub is a paid service for graph, so we are using polygon api
    // const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${apiKey}`)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${resolution}/minute/${startTime}/${endTime}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
    const response = await axios.get(url)
    console.log("response", response.data.results.length);
    return res.send({ message: "Success", data: response.data });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: error.message, data: error.response.data });
  }
}

