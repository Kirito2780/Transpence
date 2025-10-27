import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { type JSX } from "react";
import type { ITagsDiagram } from "../../../Pages/Main Page/MainPage.tsx";

interface ITagsPieChartProps {
  data: ITagsDiagram[];

  color: string[];
}
const TagsPieChart = ({ data, color }: ITagsPieChartProps): JSX.Element => {
  console.log("Render TagsPieChart");
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius: number = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x: number = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y: number = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
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
        nameKey={"tags"}
        label={renderCustomizedLabel}
        labelLine={false}
        isAnimationActive={true}
      >
        {data.map((entry: ITagsDiagram, index: number) => (
          <Cell
            key={`cell-${entry.tags}`}
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
export default TagsPieChart;
