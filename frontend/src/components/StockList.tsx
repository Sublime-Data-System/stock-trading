import { useEffect, useState } from "react";
import { getStockIndices } from "../services/stockService";

const StockList = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getStockIndices().then((response) => {
      setStocks(response.data);
    });
  }, []);

  return (
    <div>
      {stocks.map((stock: any) => (
        <div key={stock.symbol}>
          {stock.symbol}: {stock.price}
        </div>
      ))}
    </div>
  );
};

export default StockList;
