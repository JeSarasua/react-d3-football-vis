import * as d3 from "d3";

export function parseToFantasyData(data) {
  return d3.tsvParse(data, ({ Position, Name, Total }) => ({
    Position,
    Name,
    Points: Number(Total),
  }));
}

export function groupParsedDataBasedOnProperty(parsedData, property) {
  return d3.group(parsedData, (d) => d[property]);
}

export function generateLine(xScale, yScale) {
  return d3
    .line()
    .x((d, i) => xScale(i + 1))
    .y((d) => yScale(d.Points));
}

export function get_xScale(maxLength, innerWidth) {
  return d3.scaleLinear().domain([1, maxLength]).range([0, innerWidth]);
}

export function get_yScale(data, innerHeight) {
  return d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Points)])
    .nice()
    .range([innerHeight, 0]);
}

export function get_XAxis(node, xScale, data) {
  return d3.select(node).call(d3.axisBottom(xScale).ticks(data.length));
}

export function get_YAxis(node, yScale) {
  return d3.select(node).call(d3.axisLeft(yScale));
}
