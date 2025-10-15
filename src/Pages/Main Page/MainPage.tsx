import "./MainPage.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import type { RootState } from "../../Store/Store.tsx";
import { useSelector } from "react-redux";
import InfoItem from "../../Components/InfoItem/InfoItem.tsx";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../../Components/Modal/Modal.tsx";

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
interface IBarChartData {
  date: string;
  amount: number;
}

const MainPage = () => {
  const [chartData, setChartData] = useState<IChartsData[]>([]);
  const [itemData, setItemData] = useState<IItemData[]>([]);
  const [barChartData, setBarChartData] = useState<IBarChartData[]>([]);
  const Colors: string[] = ["#d8ca84", "#8884d8"];
  const [checked, setChecked] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month - 1, 0);
  const lastDay = new Date(year, month + 1, 0);

  const [date_start, setDate_start] = useState<null | Date>(firstDay);
  const [date_end, setDate_end] = useState<null | Date>(lastDay);
  const [categories, setCategories] = useState<string[]>([]);
  const [catArr, setCatArr] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const sendTimeinterval = () => {
    const startFormatted = date_start?.toISOString().slice(0, 10);
    const endFormatted = date_end?.toISOString().slice(0, 10);

    const timeInterval = {
      date_start: startFormatted,
      date_end: endFormatted,
      tags: catArr,
    };
    axios
      .post("http://172.30.88.250:8000/graph/", timeInterval, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setChartData(res.data.total);
        setBarChartData(res.data.date_detail);
        setItemData(res.data.details);
      })
      .catch((error) => console.log(`Error:${error}`));
  };

  useEffect(() => {
    const startFormatted = date_start?.toISOString().slice(0, 10);
    const endFormatted = date_end?.toISOString().slice(0, 10);

    const data = {
      date_start: startFormatted,
      date_end: endFormatted,
      tags: catArr,
    };

    axios
      .post("http://172.30.88.250:8000/graph/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setChartData(res.data.total);
        setBarChartData(res.data.date_detail);
        setItemData(res.data.details);
      })
      .catch((error) => console.log(`Error:${error}`));
  }, []);
  useEffect(() => {
    console.log(date_end?.toISOString().slice(0, 10));
  }, [catArr]);

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/tags/")
      .then((res) => {
        setCategories(res.data.tags);
      })
      .catch((err) => console.log(err));
  }, []);

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
      <Modal open={modal}>
        <div className="datePickerWrapper">
          <div className={"closeDataPickWrapperButtonWrapper"}>
            <button
              className={"closeDataPickButton"}
              onClick={() => setModal(false)}
            >
              x
            </button>
          </div>
          <h2 className={"datePickerHeader"}>Select time time interval</h2>
          <label className={"datePickerLabel"}>from</label>
          <DatePicker
            selected={date_start}
            onChange={(date) => setDate_start(date)}
            dateFormat={"yyyy-MM-dd"}
            className={"myDateInput"}
            portalId="start-date-portal"
          />
          <label className={"datePickerLabel"}>to</label>
          <DatePicker
            selected={date_end}
            onChange={(date) => setDate_end(date)}
            dateFormat={"yyyy-MM-dd"}
            className={"myDateInput"}
            portalId="end-date-portal"
          />
        </div>
        <h2 className={"datePickerTags"}>Select Tags</h2>
        <div className={"categoryWrapper"}>
          {categories.length > 0 &&
            categories.map((category, index) => (
              <div className={"categoryItemWrapper"} key={index}>
                <label>{category}</label>
                <input
                  type="checkbox"
                  value={category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCatArr((prev) =>
                      prev.includes(value)
                        ? prev.filter((item) => item !== value)
                        : [...prev, value],
                    );
                  }}
                />
              </div>
            ))}
        </div>
        <div className={"datePickerButtonWrapper"}>
          <button className={"datePickerButton"} onClick={sendTimeinterval}>
            set time interval
          </button>
        </div>
      </Modal>
      <header className="Main-header">
        <h1 className={"MainTitle"}>
          <span className={"MainTitleFirst"}>Trans</span>
          <span className={"MainTitleSecond"}>pence</span>
        </h1>

        <h2 className={"SecondTitle"}>Profile</h2>
      </header>
      <main className={"MainContent"}>
        <div>
          <svg
            viewBox="0 0 24 24"
            width={50}
            height={50}
            onClick={() => setModal(true)}
            className={"calendarSvg"}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M6.94028 2C7.35614 2 7.69326 2.32421 7.69326 2.72414V4.18487C8.36117 4.17241 9.10983 4.17241 9.95219 4.17241H13.9681C14.8104 4.17241 15.5591 4.17241 16.227 4.18487V2.72414C16.227 2.32421 16.5641 2 16.98 2C17.3958 2 17.733 2.32421 17.733 2.72414V4.24894C19.178 4.36022 20.1267 4.63333 20.8236 5.30359C21.5206 5.97385 21.8046 6.88616 21.9203 8.27586L22 9H2.92456H2V8.27586C2.11571 6.88616 2.3997 5.97385 3.09665 5.30359C3.79361 4.63333 4.74226 4.36022 6.1873 4.24894V2.72414C6.1873 2.32421 6.52442 2 6.94028 2Z"
                fill="#202020"
              ></path>{" "}
              <path
                opacity="0.5"
                d="M21.9995 14.0001V12.0001C21.9995 11.161 21.9963 9.66527 21.9834 9H2.00917C1.99626 9.66527 1.99953 11.161 1.99953 12.0001V14.0001C1.99953 17.7713 1.99953 19.6569 3.1711 20.8285C4.34267 22.0001 6.22829 22.0001 9.99953 22.0001H13.9995C17.7708 22.0001 19.6564 22.0001 20.828 20.8285C21.9995 19.6569 21.9995 17.7713 21.9995 14.0001Z"
                fill="#b6b6b6"
              ></path>{" "}
              <path
                d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z"
                fill="#1C274C"
              ></path>{" "}
            </g>
          </svg>
        </div>
        {chartData.length && barChartData.length > 0 ? (
          !checked ? (
            chartData.length > 0 && (
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
                <Legend />
              </PieChart>
            )
          ) : (
            chartData.length > 0 && (
              <ResponsiveContainer
                width={Math.max(barChartData.length * 80, 1400)}
                height={500}
              >
                <BarChart data={barChartData}>
                  <XAxis dataKey={"date"} />
                  <YAxis />
                  <Bar
                    dataKey={"incomes"}
                    fill={"#8884d8"}
                    stackId="stack"
                  ></Bar>
                  <Bar
                    dataKey={"expenses"}
                    fill={"#d8ca84"}
                    stackId="stack"
                  ></Bar>
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#000" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            )
          )
        ) : (
          <h2 className={"NoData"}>No available data to Show</h2>
        )}

        <div className={"toggleGraphContainer"}>
          <svg
            fill={checked ? "#000" : "#fff"}
            height="25px"
            width="25px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 59.903 59.903"
            className={"pieChartSvg"}
            onClick={() => setChecked((checked) => !checked)}
          >
            <g>
              <path
                d="M57.313,42.578l0.39-0.924c5.998-15.377-0.878-32.875-15.924-39.262C38.039,0.805,34.099,0,30.07,0
		C18.002,0,7.157,7.178,2.442,18.286c-3.131,7.376-3.202,15.53-0.2,22.96s8.717,13.246,16.094,16.377
		c3.736,1.586,7.588,2.28,11.616,2.28h0c3.808,0,7.627-0.606,11.182-2.019l0.935-0.372L31.63,31.677L57.313,42.578z"
              />
              <path
                d="M59.579,46.078L35.93,36.039l9.36,23.166c0.171,0.424,0.578,0.698,1.036,0.698l0.267-0.011l0.198-0.091
		c5.565-2.545,10.162-6.933,12.944-12.352c0.143-0.276,0.163-0.602,0.058-0.895L59.579,46.078z"
              />
            </g>
          </svg>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill={checked ? "#fff " : "#000"}
            onClick={() => setChecked((checked) => !checked)}
            xmlns="http://www.w3.org/2000/svg"
            className={"barChartSvg"}
          >
            <path
              d="M12 19L12 11"
              stroke={checked ? "#fff " : "#000"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M7 19L7 15"
              stroke={checked ? "#fff " : "#000"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M17 19V6"
              stroke={checked ? "#fff " : "#000"}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="checkbox"
            className={"toggleGraph"}
            id={"toggleGraph"}
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
          />
          <label htmlFor="toggleGraph" className={"toggleGraphLabel"}></label>
        </div>
        <section className={"expenses"}>
          {itemData.length > 0 ? (
            <motion.div
              className={"infoItemsWrapper"}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
            </motion.div>
          ) : (
            <h2 className={"NoData"}>No available data to Show</h2>
          )}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
