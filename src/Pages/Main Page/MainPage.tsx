import "./MainPage.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { RootState } from "../../Store/Store.tsx";
import { useSelector } from "react-redux";
import InfoItem from "../../Components/InfoItem/InfoItem.tsx";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../../Components/Modal/Modal.tsx";
import ChartsContainer from "../../Components/ChartsContainer/ChartsContainer.tsx";
import { ChartSwitcher } from "../../Components/ChartSwitcher/ChartSwitcher.tsx";
import { Calendar } from "../../Components/Calendar/Calendar.tsx";
import ChartTypeSwitcher from "../../Components/ChartTypeSwitcher/ChartTypeSwitcher.tsx";

export interface IChartsData {
  operation_type: string;
  total_amount: number;
  count_operations: number;
  [key: string]: string | number;
}
export interface IItemData {
  id: number;
  title: string;
  date: string;
  operation_type: string;
  tags: string;
  total: number;
  svg: string;
}
export interface IBarChartData {
  date: string;
  amount: number;
}
export interface ITagsDiagram {
  tags: string;
  total_amount: number;

  [key: string]: string | number;
}

const MainPage = () => {
  const [chartData, setChartData] = useState<IChartsData[]>([]);
  const [itemData, setItemData] = useState<IItemData[]>([]);
  const [barChartData, setBarChartData] = useState<IBarChartData[]>([]);
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
  const [search, setSearch] = useState<string>("");
  const [catArr, setCatArr] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [tagsDiagram, setTagsDiagram] = useState<ITagsDiagram[]>([]);
  const [changeDiagram, setChangeDiagram] = useState<boolean>(false);
  const filterItems = useMemo(
    () =>
      itemData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, itemData],
  );
  const handleModal: (value: boolean) => void = () => {
    setModal(true);
  };

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
        setTagsDiagram(res.data.tags_detail);

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
        setTagsDiagram(res.data.tags_detail);
      })
      .catch((error) => console.log(`Error:${error}`));
  }, [token]);

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/tags/")
      .then((res) => {
        setCategories(res.data.tags);
      })
      .catch((err) => console.log(err));
  }, []);
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
        <Calendar onStateChange={handleModal} />
        {chartData.length > 0 && tagsDiagram.length && !checked ? (
          <ChartSwitcher
            changeDiagram={changeDiagram}
            setChangeDiagram={setChangeDiagram}
          />
        ) : null}
        <ChartsContainer
          chartData={chartData}
          barChartData={barChartData}
          tagsDiagram={tagsDiagram}
          checked={checked}
          changeDiagram={changeDiagram}
        />

        <ChartTypeSwitcher checked={checked} setChecked={setChecked} />
        <section className={"expenses"}>
          <input
            type="text"
            className={"searchInput"}
            placeholder={"search operation by name"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {itemData.length > 0 ? (
            <motion.div
              className={"infoItemsWrapper"}
              initial={{ opacity: 0, y: 250 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              {!itemData ? (
                <h2>Loading...</h2>
              ) : search.length == 0 ? (
                itemData.map((item, i) => (
                  <InfoItem
                    key={i}
                    id={item.id}
                    tags={item.tags}
                    svg={item.svg}
                    total={item.total}
                    date={item.date}
                    title={item.title}
                    operation_type={item.operation_type}
                  />
                ))
              ) : filterItems.length == 0 ? (
                <h2>no suggestion</h2>
              ) : (
                filterItems.map((item, i) => (
                  <InfoItem
                    key={i}
                    id={item.id}
                    tags={item.tags}
                    svg={item.svg}
                    total={item.total}
                    date={item.date}
                    title={item.title}
                    operation_type={item.operation_type}
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
