export function PlayerTooltip({ tooltip }) {
  return (
    <div
      style={{
        position: "fixed",
        left: tooltip.x + 10,
        top: tooltip.y + 10,
        background: "white",
        color: "black",
        padding: "4px 8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      {tooltip.text}
    </div>
  );
}
