import { useEffect, useState } from "react";
import { getApiStats } from "../services/statsService";

const Statistics = () => {
  const [stats, setStats]: any = useState({});

  useEffect(() => {
    getApiStats().then((response) => {
      setStats(response.data);
    });
  }, []);

  return (
    <div>
      <h1>API Usage Statistics</h1>
      <p>Total Queries: {stats.totalQueries}</p>
      <p>Remaining Queries: {stats.remainingQueries}</p>
    </div>
  );
};

export default Statistics;
