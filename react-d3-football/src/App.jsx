import LineChart from "./components/line-chart";
import { rawData } from "./raw-data";

export default function App() {
  return (
    <LineChart
      data={rawData}
      margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
    />
  );
}
