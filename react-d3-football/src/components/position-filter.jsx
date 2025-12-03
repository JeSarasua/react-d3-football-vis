import { useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
export function PositionFilter({ setShowPosition }) {
  const [RBChecked, setRBChecked] = useState(true);
  const [WRChecked, setWRChecked] = useState(true);

  const handleRBChange = (event) => {
    const checked = event.target.checked;
    setRBChecked(checked);

    setShowPosition((prev) => {
      const updated = new Map(prev);
      updated.set("RB", checked);
      return updated;
    });
  };

  const handleWRChange = (event) => {
    const checked = event.target.checked;
    setWRChecked(checked);

    setShowPosition((prev) => {
      const updated = new Map(prev);
      updated.set("WR", checked);
      return updated;
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        <FormControlLabel
          label="Running Back"
          control={<Checkbox checked={RBChecked} onChange={handleRBChange} />}
        />
        <FormControlLabel
          label="Wide Receiver"
          control={<Checkbox checked={WRChecked} onChange={handleWRChange} />}
        />
      </Box>
    </>
  );
}
