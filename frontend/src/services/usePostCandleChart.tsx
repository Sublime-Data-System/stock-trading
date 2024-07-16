import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
      return response.data;
    } else {
      throw new Error("Access token is missing");
    }
  };

  return useMutation({
    mutationFn: createChart,
  });
};

export default usePostCandleChart;

/*
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useAuth from "../auth/useAuth";
import usePostCandleChart from "@/services/candleChartService";
import { useRouter } from "next/router";

interface TickerData {
  Date: Date;
  Open: number;
  Close: number;
  Low: number;
  High: number;
}

const CandlestickChart = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { symbol } = router.query;

  const svgRef = useRef<SVGSVGElement | null>(null);
  console.log(user, "user");
  console.log(svgRef, "svg");

  const {
    mutate: createChart,
    data: candleResponse,
    error,
  } = usePostCandleChart(user);

  useEffect(() => {
    if (symbol && user) {
      createChart(symbol);
    }
  }, [symbol, user]);

  useEffect(() => {
    if (!candleResponse) return;

    // Transform the candleResponse data into the format required by D3
    if (candleResponse?.results) {
      const transformedData = candleResponse?.results?.map((d: any) => ({
        Date: new Date(d.t), // assuming t is in milliseconds
        Open: d.o,
        Close: d.c,
        Low: d.l,
        High: d.h,
      }));

      // Declare the chart dimensions and margins
      const width = 928;
      const height = 600;
      const marginTop = 20;
      const marginRight = 30;
      const marginBottom = 30;
      const marginLeft = 40;

      // Declare the positional encodings
      const x = d3
        .scaleBand()
        .domain(transformedData.map((d) => d.Date))
        .range([marginLeft, width - marginRight])
        .padding(0.2);

      const y = d3
        .scaleLog()
        .domain([
          d3.min(transformedData, (d) => d.Low)!,
          d3.max(transformedData, (d) => d.High)!,
        ])
        .rangeRound([height - marginBottom, marginTop]);

      // Create the SVG container
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height);

      // Clear previous contents of the SVG
      svg.selectAll("*").remove();

      // Append the axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.utcFormat("%-m/%-d")))
        .call((g) => g.select(".domain").remove());

      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(
          d3
            .axisLeft(y)
            .tickFormat(d3.format("$~f"))
            .tickValues(
              d3
                .scaleLinear()
                .domain(y.domain() as any)
                .ticks()
            )
        )
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight)
        )
        .call((g) => g.select(".domain").remove());

      // Create a group for each day of data, and append two lines to it
      const g = svg
        .append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .selectAll("g")
        .data(transformedData)
        .join("g")
        .attr("transform", (d) => `translate(${x(d.Date)},0)`);

      g.append("line")
        .attr("y1", (d) => y(d.Low))
        .attr("y2", (d) => y(d.High));

      g.append("line")
        .attr("y1", (d) => y(d.Open))
        .attr("y2", (d) => y(d.Close))
        .attr("stroke-width", x.bandwidth())
        .attr("stroke", (d) =>
          d.Open > d.Close
            ? d3.schemeSet1[0]
            : d.Close > d.Open
            ? d3.schemeSet1[2]
            : d3.schemeSet1[8]
        );

      // Append a title (tooltip)
      const formatDate = d3.utcFormat("%B %-d, %Y");
      const formatValue = d3.format(".2f");
      const formatChange = (
        (f) => (y0, y1) =>
          f((y1 - y0) / y0)
      )(d3.format("+.2%"));

      g.append("title").text(
        (d) => `${formatDate(d.Date)}
          Open: ${formatValue(d.Open)}
          Close: ${formatValue(d.Close)} (${formatChange(d.Open, d.Close)})
          Low: ${formatValue(d.Low)}
          High: ${formatValue(d.High)}`
      );
    }
  }, [candleResponse]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return <svg ref={svgRef}></svg>;
};

export default CandlestickChart;

*/
