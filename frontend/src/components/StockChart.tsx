import { Line } from "react-chartjs-2";

const StockChart = ({ data }: any) => {
  const chartData = {
    labels: data.map((d: any) => d.time),
    datasets: [
      {
        label: "Stock Price",
        data: data.map((d: any) => d.price),
        fill: false,
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  };

  return <Line data={chartData} />;
};

export default StockChart;
