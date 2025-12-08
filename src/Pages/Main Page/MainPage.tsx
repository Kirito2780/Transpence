import "./MainPage.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { RootState } from "../../Store/Store.tsx";
import { useSelector, useDispatch } from "react-redux";
import InfoItem from "../../Components/InfoItem/InfoItem.tsx";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../../Components/Modal/Modal.tsx";
import ChartsContainer from "../../Components/ChartsContainer/ChartsContainer.tsx";
import { ChartSwitcher } from "../../Components/ChartSwitcher/ChartSwitcher.tsx";
import { Calendar } from "../../Components/Calendar/Calendar.tsx";
import ChartTypeSwitcher from "../../Components/ChartTypeSwitcher/ChartTypeSwitcher.tsx";
import Pagination from "../../Components/Pagination/Pagination";
import { NavLink } from "react-router-dom";
import { setFirstDay } from "../../Slices/dateSlice.tsx";

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
  const [page, setPage] = useState<number>(1);
  const OperationsPerPage: number = 5;
  const [barChartData, setBarChartData] = useState<IBarChartData[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const reduxDate = useSelector((state: RootState) => state.DateSlice.firstDay);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const [date_start, setDate_start] = useState<null | Date>(null);
  const [date_end, setDate_end] = useState<null | Date>(lastDay);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [catArr, setCatArr] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [tagsDiagram, setTagsDiagram] = useState<ITagsDiagram[]>([]);
  const [changeDiagram, setChangeDiagram] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [profileMenu, setProfileMenu] = useState<boolean>(false);
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
  useEffect(() => {
    console.log(date_start);
    console.log(date_end);
  }, [date_start, date_end]);

  useEffect(() => {
    if (date_end != null && date_start != null && isConfirmed) {
      sendTimeinterval();
    }
  }, [date_end, date_start, isConfirmed]);

  const sendTimeinterval = () => {
    if (!date_start || !date_end) return;
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
        setIsConfirmed(false);
        setItemData(res.data.details);
      })
      .catch((error) => console.log(`Error:${error}`));
  };
  const PaginatedItemData = useMemo(() => {
    return itemData.slice(
      (page - 1) * OperationsPerPage,
      page * OperationsPerPage,
    );
  }, [page, itemData, date_start, date_end]);

  const PagesLength = useMemo(() => {
    return Math.ceil(itemData.length / OperationsPerPage);
  }, [itemData]);

  useEffect(() => {
    const browserDateRaw = sessionStorage.getItem("date_start");
    const browserDateReady = browserDateRaw ? new Date(browserDateRaw) : null;

    if (reduxDate != null) {
      const localDate = new Date(reduxDate);
      setDate_start(localDate);
    } else if (browserDateReady != null) {
      setDate_start(browserDateReady);
    } else {
      const baseDate = new Date(year, month, 1);
      setDate_start(baseDate);
    }
  }, [token]);

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/tags/")
      .then((res) => {
        setCategories(res.data.tags);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setUserName(res.data.username))
      .catch((err) => console.log(err));
  }, [token]);

  const LogOut = async () => {
    if (!token) return;

    try {
      await axios
        .post(
          "http://172.30.88.250:8000/auth/token/logout/",
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        .catch((err) => console.log(err));

      localStorage.removeItem("token");
      location.reload();
    } catch (err) {
      console.log(err);
    }
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
            onChange={(date) => {
              setDate_start(date);
              dispatch(setFirstDay(date?.toISOString()));
              date
                ? sessionStorage.setItem("date_start", date.toISOString())
                : null;
            }}
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
            categories.map((category) => (
              <div className={"categoryItemWrapper"} key={category}>
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
          <button
            className={"datePickerButton"}
            onClick={() => {
              sendTimeinterval();
              setModal(false);
              setIsConfirmed(true);
            }}
          >
            set time interval
          </button>
        </div>
      </Modal>
      <header className="Main-header">
        <h1 className={"MainTitle"}>
          <span className={"MainTitleFirst"}>Trans</span>
          <span className={"MainTitleSecond"}>pence</span>
        </h1>

        <div>
          <h2
            onClick={() => setProfileMenu((prev) => !prev)}
            className={"SecondTitle"}
          >
            {userName}
          </h2>
          <div
            className={
              profileMenu ? "profile-menu-showed" : "profile-menu-hidden"
            }
          >
            <div className={"profile-menu-item-wrapper"}>
              <NavLink to={"/profile"} className="profile-menu-item">
                <svg
                  className={"profile-menu-svg"}
                  width="30px"
                  height="30px"
                  viewBox="0 0 20 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-420.000000, -2159.000000)"
                      fill="#000000"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M374,2009 C371.794,2009 370,2007.206 370,2005 C370,2002.794 371.794,2001 374,2001 C376.206,2001 378,2002.794 378,2005 C378,2007.206 376.206,2009 374,2009 M377.758,2009.673 C379.124,2008.574 380,2006.89 380,2005 C380,2001.686 377.314,1999 374,1999 C370.686,1999 368,2001.686 368,2005 C368,2006.89 368.876,2008.574 370.242,2009.673 C366.583,2011.048 364,2014.445 364,2019 L366,2019 C366,2014 369.589,2011 374,2011 C378.411,2011 382,2014 382,2019 L384,2019 C384,2014.445 381.417,2011.048 377.758,2009.673"
                          id="profile-[#1335]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
                <div className={"profile-menu-item-profile"}>Profile</div>
              </NavLink>
              <div className="profile-menu-item" onClick={LogOut}>
                <svg
                  className={"profile-menu-svg-cross"}
                  fill="#000000"
                  width="30px"
                  height="30px"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
                </svg>
                <p>Log out</p>
              </div>
            </div>
          </div>
        </div>
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
                PaginatedItemData.map((item) => (
                  <InfoItem
                    key={item.id}
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
                filterItems.map((item) => (
                  <InfoItem
                    key={item.id}
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

          {itemData.length > 0 ? (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pagesLength={PagesLength}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
