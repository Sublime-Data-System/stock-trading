import { useQuery } from "@tanstack/react-query";
// import fetchStockData from "./fetchStockData"; // Adjust the path according to your project structure
import axios from "axios";

const useFetchStockData = (user: any) => {
  const fetchStockData = async (user: any) => {
    const accessToken = user?.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (accessToken) {
      const { data } = await axios.get(`${API_URL}/stock`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    } else {
      throw new Error("Access token is missing");
    }
  };

  return useQuery({
    queryKey: ["get-stock-data"],
    queryFn: () => fetchStockData(user),
    enabled: !!user,
  });
};

export default useFetchStockData;
