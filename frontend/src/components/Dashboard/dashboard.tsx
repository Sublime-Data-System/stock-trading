import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/Table"; // Adjust the path according to your project structure
import useAuth from "../auth/useAuth";
import useFetchStockData from "@/services/stockService";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const { user, loading: authLoading }: { user: any; loading: any } = useAuth();
  const router = useRouter();

  const { data: stockData, error, isLoading } = useFetchStockData(user);
  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  const handleRowClick = (symbol: string) => {
    router.push(`dashboard/${symbol}`);
  };
  return (
    <div className="p-4 ">
      <Table>
        <TableCaption>A list of financial instruments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Display Symbol</TableHead>
            <TableHead>FIGI</TableHead>
            <TableHead>MIC</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockData?.data.map((item: any, index: any) => (
            <TableRow onClick={() => handleRowClick(item.symbol)} key={index}>
              <TableCell>{item.currency}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.displaySymbol}</TableCell>
              <TableCell>{item.figi}</TableCell>
              <TableCell>{item.mic}</TableCell>
              <TableCell>{item.symbol}</TableCell>
              <TableCell>{item.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>End of data</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div></div>
    </div>
  );
};

export default Dashboard;
