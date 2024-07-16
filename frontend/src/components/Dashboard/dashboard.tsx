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
import useFetchStockData from "@/services/useFetchStockData";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const { user, loading: authLoading }: { user: any; loading: any } = useAuth();
  const router = useRouter();

  const { data: stockData, error, isLoading } = useFetchStockData(user);
  if (authLoading || isLoading) {
    return (
      <div className="p-2.5 w-full bg-white mt-[28px] ">
        <div>
          <div>
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
            <div className="h-7 m-2 bg-gray-300 animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  const handleRowClick = (symbol: string) => {
    router.push(`dashboard/${symbol}`);
  };
  return (
    <div className="flex items-center flex-col w-full bg-white mt-[28px] p-2.5 border border-gray-200 rounded-lg shadow ">
      <Table>
        <TableCaption>A list of financial instruments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Display Symbol</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>FIGI</TableHead>
            <TableHead>MIC</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockData?.data.map((item: any, index: any) => (
            <TableRow
              className="cursor-pointer"
              onClick={() => handleRowClick(item.symbol)}
              key={index}
            >
              <TableCell>{item.displaySymbol}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.figi}</TableCell>
              <TableCell>{item.mic}</TableCell>
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
