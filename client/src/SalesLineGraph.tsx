// src/components/SalesLineGraph.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SalesLineGraphProps {
  salesReportData: Map<string, number>;
}

const SalesLineGraph: React.FC<SalesLineGraphProps> = ({ salesReportData }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    if (!salesReportData.size) return;

    const svg = d3.select(graphRef.current);

    const data = Array.from(salesReportData.entries()).map(([date, value]) => ({
      date,
      value: Number(value), // Ensure that value is a number
    }));

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
      .range([margin.left, width + margin.left]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([height + margin.top, margin.top]);

    const line = d3
      .line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    svg.selectAll('*').remove(); // Clear previous elements

    svg
      .append('g')
      .attr('transform', `translate(0, ${height + margin.top})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue');

  }, [salesReportData]);

  return <svg ref={graphRef} width={600} height={400} />;
};

export default SalesLineGraph;


