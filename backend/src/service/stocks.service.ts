import axios from 'axios';

// FinnHub JS SDK does not work
const finnhubAPIKey = process.env.FINNHUB_API_KEY;
const polygonAPIKey = process.env.POLYGON_API_KEY;

export const getStocks = async () => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubAPIKey}`
    );

    return response.data
  } catch (error) {
    throw error
  }
}

export const getCandles = async (symbol, resolution, startTime, endTime) => {
  try {
    // Note: Finnhub is a paid service for graph, so we are using polygon api
    // const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${apiKey}`)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${resolution}/minute/${startTime}/${endTime}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
    const response = await axios.get(url);
  
    return response.data
  } catch (error) {
    throw error
  }
}

export const getStockPrice = async (symbol) => {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubAPIKey}`;
    const response = await axios.get(url);
  
    return response.data
  } catch (error) {
    throw error
  }
}