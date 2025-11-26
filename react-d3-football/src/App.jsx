import "./App.css";
import LineChart from "./components/line-chart";
import { rawData } from "./raw-data";

export default function App() {
  return (
    <>
      <h1> Fantasy Football Points</h1>
      <LineChart
        data={rawData}
        width={2500}
        height={900}
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
      />
    </>
  );
}
