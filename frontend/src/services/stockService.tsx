import axios from "axios";

const API_URL = "https://financialmodelingprep.com/api/v3";

export const getStockIndices = () => {
  return axios.get(`${API_URL}/quote/indices?apikey=your_api_key`);
};
