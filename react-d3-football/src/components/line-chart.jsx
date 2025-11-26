import * as d3 from "d3";

function parseToFantasyData(data) {
  return d3.tsvParse(data, ({ Position, Name, Total }) => ({
    Position,
    Name,
    Points: Number(Total),
  }));
}

function groupParsedDataBasedOnProperty(parsedData, property) {
  return d3.group(parsedData, (d) => d[property]);
}

function generateLine(xScale, yScale) {
  return d3
    .line()
    .x((d, i) => xScale(i + 1))
    .y((d) => yScale(d.Points));
}

export default function LineChart({ data, width, height, margin }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const parsedData = parseToFantasyData(data);
  const groupedData = groupParsedDataBasedOnProperty(parsedData, "Position");

  const maxLength = Math.max(
    ...Array.from(groupedData.values()).map((arr) => arr.length)
  );

  const xScale = d3.scaleLinear().domain([1, maxLength]).range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(parsedData, (d) => d.Points)])
    .nice()
    .range([innerHeight, 0]);

  // Line generator
  const lineGenerator = generateLine(xScale, yScale);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X Axis */}
        <g
          transform={`translate(0,${innerHeight})`}
          ref={(node) =>
            d3
              .select(node)
              .call(d3.axisBottom(xScale).ticks(groupedData.length))
          }
        >
          <text
            x={innerWidth / 2}
            y={margin.bottom - 3}
            fill="white"
            fontSize={24}
            textAnchor="middle"
          >
            Player Rank
          </text>
        </g>

        {/* Y Axis */}
        <g ref={(node) => d3.select(node).call(d3.axisLeft(yScale))}>
          <text
            transform={`translate(${margin.left - 80}, ${
              innerHeight / 2
            }) rotate(-90)`}
            textAnchor="middle"
            fontSize={24}
            fill="white"
          >
            Fantasy Points
          </text>
        </g>

        {/* Line Path */}
        {Array.from(groupedData.entries()).map(([position, players]) => (
          <path
            key={position}
            d={lineGenerator(players)}
            fill="none"
            stroke={position === "RB" ? "red" : "blue"}
            strokeWidth={2}
          />
        ))}

        {/* Points */}
        {Array.from(groupedData.entries()).map(([position, players]) =>
          players.map((d, i) => (
            <circle
              key={`${position}-${i}`}
              cx={xScale(i + 1)}
              cy={yScale(d.Points)}
              r={3}
              fill="white"
            />
          ))
        )}
      </g>
    </svg>
  );
}
