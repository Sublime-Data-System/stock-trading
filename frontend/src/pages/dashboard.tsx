import StockList from "../components/StockList";
import StockChart from "../components/StockChart";
import Alert from "../components/Alert";

const Dashboard = () => {
  // Sample data for the chart, replace with actual data fetching
  const sampleData = [
    { time: "10:00", price: 150 },
    { time: "11:00", price: 155 },
    // ... more data
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <StockList />
      <StockChart data={sampleData} />
      <Alert />
    </div>
  );
};

export default Dashboard;
