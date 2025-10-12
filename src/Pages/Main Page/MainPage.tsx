import "./MainPage.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import type { RootState } from "../../Store/Store.tsx";
import { useSelector } from "react-redux";
import InfoItem from "../../Components/InfoItem/InfoItem.tsx";

interface IChartsData {
  operation_type: string;
  total_amount: number;
  count_operations: number;
  [key: string]: string | number;
}
interface IItemData {
  tags: string;
  total: number;
  svg: string;
  date: string;
  title: string;
}

const MainPage = () => {
  const [chartData, setChartData] = useState<IChartsData[]>([]);
  const [itemData, setItemData] = useState<IItemData[]>([]);
  const Colors: string[] = ["#de1a24", "#056517"];
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/graph/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setChartData(res.data.total);
        setItemData(res.data.details);
      })
      .catch((error) => console.log(`Error:${error}`));
  }, []);
  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

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
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <header className="Main-header">
        <h1 className={"MainTitle"}>
          <span className={"MainTitleFirst"}>Trans</span>
          <span className={"MainTitleSecond"}>pence</span>
        </h1>

        <h2 className={"SecondTitle"}>Profile</h2>
      </header>
      <main className={"MainContent"}>
        {chartData.length > 0 && (
          <PieChart width={500} height={500}>
            <Pie
              data={chartData}
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
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.operation_type}`}
                  fill={Colors[index % Colors.length]}
                  style={{ transition: "0.3s ease" }}
                ></Cell>
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
        <section className={"expenses"}>
          <div className={"infoItemsWrapper"}>
            {!itemData ? (
              <h2>Loading...</h2>
            ) : (
              itemData.map((item, i) => (
                <InfoItem
                  key={i}
                  tags={item.tags}
                  svg={item.svg}
                  total={item.total}
                  date={item.date}
                  title={item.title}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
