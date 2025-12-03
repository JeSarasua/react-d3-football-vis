import { useState } from "react";
import { PlayerTooltip } from "./player-tooltip";
import { PositionFilter } from "./position-filter";
import {
  parseToFantasyData,
  groupParsedDataBasedOnProperty,
  generateLine,
  get_xScale,
  get_yScale,
  get_XAxis,
  get_YAxis,
} from "../d3/d3-helpers";

export default function LineChart({ data, margin }) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    test: "",
    x: 0,
    y: 0,
  });

  const [showPosition, setShowPosition] = useState(
    new Map([
      ["RB", true],
      ["WR", true],
    ])
  );

  const VIEWBOX_WIDTH = 1920;
  const VIEWBOX_HEIGHT = 930;

  const innerWidth = VIEWBOX_WIDTH - margin.left - margin.right;
  const innerHeight = VIEWBOX_HEIGHT - margin.top - margin.bottom;

  const parsedData = parseToFantasyData(data);
  const groupedData = groupParsedDataBasedOnProperty(parsedData, "Position");

  const maxNumPosPlayers = Math.max(
    ...Array.from(groupedData.values()).map((arr) => arr.length)
  );

  const xScale = get_xScale(maxNumPosPlayers, innerWidth);
  const yScale = get_yScale(parsedData, innerHeight);
  const lineGenerator = generateLine(xScale, yScale);

  return (
    <>
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Title */}
          <text
            x={innerWidth / 2}
            y={margin.top}
            fill="white"
            fontSize={48}
            textAnchor="middle"
          >
            Fantasy Football Scoring
          </text>

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

          {/* Line */}
          {Array.from(groupedData.entries())
            .filter(([position]) => showPosition.get(position))
            .map(([position, players]) => (
              <path
                key={position}
                d={lineGenerator(players)}
                fill="none"
                stroke={position === "RB" ? "red" : "blue"}
                strokeWidth={2}
              />
            ))}

          {/* Dots on the Line */}
          {Array.from(groupedData.entries())
            .filter(([position]) => showPosition.get(position))
            .map(([position, players]) =>
              players.map((d, i) => (
                <circle
                  key={`${position}-${i}`}
                  cx={xScale(i + 1)}
                  cy={yScale(d.Points)}
                  r={6}
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
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 8,
          borderRadius: 4,
          display: "flex",
          gap: "10px",
        }}
      >
        <PositionFilter setShowPosition={setShowPosition} />
      </div>
      {tooltip.visible && <PlayerTooltip tooltip={tooltip} />}
    </>
  );
}
