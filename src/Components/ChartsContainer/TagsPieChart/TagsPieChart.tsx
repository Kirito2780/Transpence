//import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import { type JSX } from "react";
import type { ITagsDiagram } from "../../../Pages/Main Page/MainPage.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Store/Store.tsx";

interface ITagsPieChartProps {
  data: ITagsDiagram[];

  color: string[];
}
const TagsPieChart = ({ data, color }: ITagsPieChartProps): JSX.Element => {
  const totalSum = data.reduce((sum, item) => sum + item.total_amount, 0);
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.total_amount,
    label: String(item.tags),
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
            arcLabelRadius: "60%",
            arcLabel: (d) => {
              const percent = (d.value / totalSum) * 100;
              if (percent >= 4) {
                return `${percent.toFixed(0)}%`;
              }
              return "";
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
export default TagsPieChart;
