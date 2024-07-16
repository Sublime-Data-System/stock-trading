import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface TickerData {
  Date: Date;
  Open: number;
  Close: number;
  Low: number;
  High: number;
  Volume: number;
}

const usePostCandleChart = (user: any) => {
  const createChart = async (symbol: any) => {
    const accessToken = user?.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const data = {
      symbol: symbol,
      resolution: 15,
    };
    if (accessToken) {
      const response = await axios.post(`${API_URL}/stock/candle`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = response.data?.data?.results || [];

      const transformedData: TickerData[] = responseData.map((d: any) => ({
        Date: new Date(d.t), // Assuming `d.t` is already in milliseconds
        Open: d.o,
        High: d.h,
        Low: d.l,
        Close: d.c,
        Volume: d.v,
        "Adj Close": d.c,
      }));

      return { data: transformedData, ticker: response.data?.data?.ticker };
    } else {
      throw new Error("Access token is missing");
    }
  };

  return useMutation({
    mutationFn: createChart,
  });
};

export default usePostCandleChart;
