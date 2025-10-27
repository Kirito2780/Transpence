import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import type { IChartsData } from "../../../Pages/Main Page/MainPage.tsx";
import { type JSX } from "react";

interface IPieChartProps {
  data: IChartsData[];

  color: string[];
}

const CustomPieChart = ({ data, color }: IPieChartProps): JSX.Element => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart width={500} height={500}>
      <Pie
        data={data}
        cx={"50%"}
        cy={"50%"}
        outerRadius={200}
        stroke="whitesmoke"
        dataKey={"total_amount"}
        nameKey={"operation_type"}
        label={renderCustomizedLabel}
        labelLine={false}
        isAnimationActive={true}
      >
        {data.map((entry: IChartsData, index: number) => (
          <Cell
            key={`cell-${entry.operation_type}`}
            fill={color[index % color.length]}
            style={{ transition: "0.3s ease" }}
          ></Cell>
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
export default CustomPieChart;
