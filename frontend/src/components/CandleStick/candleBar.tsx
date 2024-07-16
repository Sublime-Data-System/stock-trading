import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useAuth from "../auth/useAuth";
import usePostCandleChart from "@/services/usePostCandleChart";
import { useRouter } from "next/router";

import CandleDetails from "./candleDetails";

const CandlestickChart = () => {
  const { user, loading: authLoading }: { user: any; loading: any } = useAuth();
  const router = useRouter();
  const { symbol } = router.query;

  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    mutate: createChart,
    data: candleResponse,
    error,
    isPending: isLoading,
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
    if (candleResponse && candleResponse?.data?.length > 0) {
      const data = candleResponse?.data;

      // Chart dimensions and margins
      const width = 1100;
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
  }, [candleResponse]);

  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!candleResponse?.data.length) {
    return (
      <div className="p-2 w-100 h-200 bg-slate-200 border-b-gray-100">
        <h1 className="font-semibold">No Data Available</h1>
      </div>
    );
  }

  const latestEntry = candleResponse?.data[candleResponse?.data.length - 1];

  return (
    <div className="flex items-center flex-col w-full bg-white mt-[28px] border border-gray-200 rounded-lg shadow ">
      <div>
        <h2 className="my-[20px]">
          Stock : <span className="font-bold"> {candleResponse?.ticker} </span>
        </h2>
      </div>

      {candleResponse?.data && <svg ref={svgRef}></svg>}

      <CandleDetails
        open={latestEntry?.Open || 0}
        high={latestEntry?.High || 0}
        close={latestEntry?.Close || 0}
        low={latestEntry?.Low || 0}
        volume={latestEntry?.Volume || 0}
      />
    </div>
  );
};

export default CandlestickChart;