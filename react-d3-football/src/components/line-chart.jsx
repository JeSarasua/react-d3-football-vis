import { useState } from "react";
import { PlayerTooltip } from "./player-tooltip";
import {
  parseToFantasyData,
  groupParsedDataBasedOnProperty,
  generateLine,
  get_xScale,
  get_yScale,
  get_XAxis,
  get_YAxis,
} from "../d3/d3-helpers";

export default function LineChart({ data, width, height, margin }) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    test: "",
    x: 0,
    y: 0,
  });

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const parsedData = parseToFantasyData(data);
  const groupedData = groupParsedDataBasedOnProperty(parsedData, "Position");

  const maxLength = Math.max(
    ...Array.from(groupedData.values()).map((arr) => arr.length)
  );

  const xScale = get_xScale(maxLength, innerWidth);
  const yScale = get_yScale(parsedData, innerHeight);
  const lineGenerator = generateLine(xScale, yScale);

  return (
    <>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* X Axis */}
          <g
            transform={`translate(0,${innerHeight})`}
            ref={(node) => get_XAxis(node, xScale, groupedData)}
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
          <g ref={(node) => get_YAxis(node, yScale)}>
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
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  setTooltip({
                    visible: true,
                    text: `${d.Name} -> ${d.Points} #${i}`,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseLeave={() => {
                  setTooltip({
                    visible: false,
                    text: "",
                    x: 0,
                    y: 0,
                  });
                }}
              />
            ))
          )}
        </g>
      </svg>
      {tooltip.visible && <PlayerTooltip tooltip={tooltip} />}
    </>
  );
}
