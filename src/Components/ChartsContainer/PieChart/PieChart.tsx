import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import "./PieChart.css";

import type { IChartsData } from "../../../Pages/Main Page/MainPage.tsx";
import { type JSX } from "react";
import type { RootState } from "../../../Store/Store.tsx";
import { useSelector } from "react-redux";

interface IPieChartProps {
  data: IChartsData[];
  color: string[];
}

const CustomPieChart = ({ data, color }: IPieChartProps): JSX.Element => {
  const totalSum = data.reduce((sum, item) => sum + item.total_amount, 0);
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.total_amount,
    label: String(item.operation_type),
    color: color[index % color.length],
    rawValue: item.total_amount,
    percent: Math.round((item.total_amount / totalSum) * 100 * 100) / 100,
  }));

  return (
    <div className="CustomPieChartWrapper">
      <PieChart
        series={[
          {
            data: chartData,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            valueFormatter: (d) => `${d.value.toLocaleString()}${currency}`,
            arcLabel: (d) => {
              const percent = ((d.value / totalSum) * 100).toFixed(0);
              return `${percent}%`;
            },
          },
        ]}
        height={470}
        width={500}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontSize: 14,
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
};
export default CustomPieChart;
