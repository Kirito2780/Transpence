import type { JSX } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IBarChartData } from "../../../Pages/Main Page/MainPage.tsx";

interface IBarChartProps {
  data: IBarChartData[];
  colors: string[];
}

const CustomBarChart = ({ data, colors }: IBarChartProps): JSX.Element => {
  return (
    <ResponsiveContainer width={Math.max(data.length * 80, 1400)} height={540}>
      <BarChart data={data}>
        <XAxis dataKey={"date"} />
        <YAxis />
        <Bar dataKey={"incomes"} fill={colors[0]} stackId="stack"></Bar>
        <Bar dataKey={"expenses"} fill={colors[1]} stackId="stack"></Bar>
        <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
        <ReferenceLine y={0} stroke="#000" />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default CustomBarChart;
