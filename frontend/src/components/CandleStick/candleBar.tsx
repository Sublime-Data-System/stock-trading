import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useAuth from "../auth/useAuth";
import usePostCandleChart from "@/services/usePostCandleChart";
import { useRouter } from "next/router";

interface TickerData {
  Date: Date;
  Open: number;
  Close: number;
  Low: number;
  High: number;
}

const CandlestickChart = () => {
  const { user, loading: authLoading }: { user: any; loading: any } = useAuth();
  const router = useRouter();
  const { symbol } = router.query;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [candleData, setCandleData] = useState<TickerData[]>([]);

  const {
    mutate: createChart,
    data: candleResponse,
    error,
  } = usePostCandleChart(user);

  const handleCreateChart = (symbol: string) => {
    createChart(symbol);
  };

  useEffect(() => {
    if (symbol && typeof symbol === "string" && user) {
      handleCreateChart(symbol);
    }
  }, [symbol, user]);

  useEffect(() => {
    if (candleResponse?.data?.results) {
      const transformedData: TickerData[] = candleResponse.data.results.map(
        (d: any) => ({
          Date: new Date(d.t), // Assuming `d.t` is already in milliseconds
          Open: d.o,
          High: d.h,
          Low: d.l,
          Close: d.c,
          Volume: d.v,
          "Adj Close": d.c,
        })
      );
      console.log(transformedData, "transformed data");
      setCandleData(transformedData);
    }
  }, [candleResponse]);

  useEffect(() => {
    if (candleData.length > 0) {
      const data = candleData;

      // Chart dimensions and margins
      const width = 928;
      const height = 600;
      const marginTop = 20;
      const marginRight = 30;
      const marginBottom = 30;
      const marginLeft = 60;

      // Scales for x and y axes
      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.Date) as [Date, Date])
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.Low) || 0,
          d3.max(data, (d) => d.High) || 0,
        ])
        .nice()
        .range([height - marginBottom, marginTop]);

      // Create SVG container
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height);

      // Clear previous contents of the SVG
      svg.selectAll("*").remove();

      // Append x axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")))
        .call((g) => g.select(".domain").remove());

      // Append y axis
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.format("$.2f")))
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight)
        )
        .call((g) => g.select(".domain").remove());

      // Create a group for each day of data, and append lines for candlesticks
      const g = svg
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${x(d.Date)},0)`);

      // Append low-high range lines
      g.append("line")
        .attr("y1", (d) => y(d.Low))
        .attr("y2", (d) => y(d.High))
        .attr("stroke", "black");

      // Calculate candlestick width (assuming daily data)
      const candleWidth = Math.min(
        20,
        (x.range()[1] - x.range()[0]) / data.length
      );

      // Append open-close rectangles with color coding
      g.append("rect")
        .attr("x", -candleWidth / 2)
        .attr("y", (d) => y(Math.max(d.Open, d.Close)))
        .attr("height", (d) => Math.abs(y(d.Open) - y(d.Close)))
        .attr("width", candleWidth)
        .attr("fill", (d) =>
          d.Open > d.Close ? d3.schemeSet1[0] : d3.schemeSet1[2]
        );

      // Append tooltips (title) to each candlestick
      g.append("title").text(
        (d) => `
          Date: ${d.Date.toDateString()}
          Open: ${d.Open}
          Close: ${d.Close}
          High: ${d.High}
          Low: ${d.Low}
        `
      );
    }
  }, [candleData]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <>
      <div>
        <h2 className="p-2">
          Stock :{" "}
          <span className="font-bold"> {candleResponse?.data?.ticker} </span>
        </h2>
      </div>
      {candleResponse?.data?.results && <svg ref={svgRef}></svg>}
      {!candleResponse?.data?.results && (
        <div className="w-100 h-100 bg-slate-200 border-b-gray-100">
          <h1></h1>
        </div>
      )}
    </>
  );
};

export default CandlestickChart;
