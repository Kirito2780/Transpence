import { NavLink, useNavigate } from "react-router-dom";
import "./ComparePage.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { MonthPicker } from "./MonthPicker.tsx";
import { YearPicker } from "./YearPicker";
import Modal from "../../Components/Modal/Modal.tsx";

export interface MonthsStats {
  first_month_stats: {
    top_tag: string;
    total_incomes: number;
    total_expenses: number;
    net_month_profit: number;
    net_day_profit: number;
    inc_exp_ratio: number;
    exp_ratio: number;
  };
  first_avg_month_stats: {
    avg_day_incomes: number;
    avg_day_expenses: number;
    avg_monthly_saving: number;
    avg_stddev: number;
  };
  second_month_stats: {
    top_tag: string;
    total_incomes: number;
    total_expenses: number;
    net_month_profit: number;
    net_day_profit: number;
    inc_exp_ratio: number;
    exp_ratio: number;
  };
  second_avg_month_stats: {
    avg_day_incomes: number;
    avg_day_expenses: number;
    avg_monthly_saving: number;
    avg_stddev: number;
  };
  month_comparison: {
    inc_comparison: number;
    percent_inc_vs_inc: number;
    exp_comparison: number;
    percent_exp_vs_exp: number;
    stddev_comparison: {
      stability_level: string;
      percent_change: number;
      title: string;
      summary: string;
      key_message: string;
      actions: string[];
      visual: {
        icon_code: string;
        color: string;
      };
    };
  };
}
export interface YearStats {
  first_year_stats: {
    total_incomes: number;
    total_expenses: number;
    top_tag: string;
    net_profit: number;
    inc_exp_ratio: number;
  };
  first_avg_year_stats: {
    avg_monthly_incomes: number;
    avg_monthly_expenses: number;
    avg_monthly_saving: number;
    avg_stddev: number;
  };
  second_year_stats: {
    total_incomes: number;
    total_expenses: number;
    top_tag: string;
    net_profit: number;
    inc_exp_ratio: number;
  };
  second_avg_year_stats: {
    avg_monthly_incomes: number;
    avg_monthly_expenses: number;
    avg_monthly_saving: number;
    avg_stddev: number;
  };
  year_comparison: {
    inc_comparison: number;
    percent_inc_vs_inc: number;
    exp_comparison: number;
    percent_exp_vs_exp: number;
    stddev_comparison: {
      stability_level: string;
      percent_change: number;
      title: string;
      summary: string;
      key_message: string;
      actions: string[];
      visual: {
        icon_code: string;
        color: string;
      };
    };
  };
}

const ComparePage = () => {
  const comparePickerAnimations = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    sent: { opacity: 0, scale: 0 },
  };

  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [toggle, setToggle] = useState<boolean>(false);
  const [firstMonth, setFirstMonth] = useState<string>("1");
  const [secondMonth, setSecondMonth] = useState<string>("2");
  const [firstYear, setFirstYear] = useState<string>("2025");
  const [secondYear, setSecondYear] = useState<string>("2026");
  const [firstNYear, setFirstNYear] = useState<number>(2025);
  const [secondNYear, setSecondNYear] = useState<number>(2026);
  const [poolUrl, setPoolUrl] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [monthData, setMonthData] = useState<MonthsStats | null>();
  const [yearData, setYearData] = useState<YearStats | null>();
  const [send, setSend] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const firstMonthName = MONTHS[Number(firstMonth) - 1];
  const secondMonthName = MONTHS[Number(secondMonth) - 1];

  useEffect(() => {
    if (poolUrl) {
      setLoading(true);
      const timer = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      let stopped = false;
      const monthRequest = async () => {
        if (stopped) return;
        const fetch = await axios.get(`http://172.30.88.250:8000${poolUrl}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log(fetch.data.status);
        if (fetch.data.status == "SUCCESS") {
          if ("first_month_stats" in fetch.data.result) {
            setLoading(false);
            setMonthData(fetch.data.result);
            console.log(fetch.data.result);
          } else if ("first_year_stats" in fetch.data.result) {
            setLoading(false);
            setYearData(fetch.data.result);
          }
          return;
        }
        if (fetch.data.status == "FAILURE") {
          setLoading(false);
          stopped = true;
          clearInterval(timer);
          setOpen(true);
          return;
        }
        setTimeout(monthRequest, 5000);
      };
      monthRequest();

      return () => {
        stopped = true;
        clearInterval(timer);
      };
    }
  }, [poolUrl]);

  const handleMonthSend = () => {
    const firstPeriod = firstYear + "-" + firstMonth;
    const secondPeriod = secondYear + "-" + secondMonth;
    const formData = new FormData();
    formData.append("first_month", firstPeriod);
    formData.append("second_month", secondPeriod);
    console.log(formData);
    axios
      .post("http://172.30.88.250:8000/compare/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setPoolUrl(res.data.check_url);
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      })
      .finally(() => {
        setSend(true);
      });
  };
  const handleYearsSend = () => {
    const formData = new FormData();
    formData.append("first_year", firstNYear.toString());
    formData.append("second_year", secondNYear.toString());
    axios
      .post("http://172.30.88.250:8000/compare/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setPoolUrl(res.data.check_url);
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      })
      .finally(() => {
        setSend(true);
      });
  };

  useEffect(() => {
    if (firstYear == secondYear && firstMonth == secondMonth) {
      setFirstMonth("1");
      setSecondMonth("2");
    }
  }, [firstMonth, secondMonth, firstYear, secondYear]);

  useEffect(() => {
    if (send && monthData) {
      navigate("/compare/month", {
        state: {
          monthData,
          firstMonthName,
          firstMonth,
          firstYear,
          secondMonthName,
          secondYear,
          secondMonth,
        },
      });
    }
  }, [send, monthData]);
  useEffect(() => {
    console.log(seconds);
  }, [seconds]);

  useEffect(() => {
    if (send && yearData) {
      navigate("/compare/year", {
        state: {
          yearData,
          firstYear,
          secondYear,
        },
      });
    }
  }, [send, yearData]);
  if (loading) {
    return (
      <div className="laodingWrapper">
        <div className="loaderWrapper">
          <span className="loader"></span>
          <AnimatePresence>
            {seconds >= 3 && (
              <motion.button
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className={"loadingButton"}
                onClick={() => {
                  navigate("/");
                }}
              >
                Exit
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal open={open}>
        <div className="ErrorContentWrapper">
          <h2>Wrong data</h2>
          <button
            className={"ComparePageModalButton"}
            onClick={() => {
              location.reload();
              setOpen(false);
            }}
          >
            back
          </button>
        </div>
      </Modal>
      <header>
        <h1 className={"MainTitlePageCompare"}>
          <NavLink to={"/"} className={"nav-link-compare"}>
            <span className={"MainTitleFirstPageCompare"}>Trans</span>
            <span className={"MainTitleSecondPageCompare"}>pence</span>
          </NavLink>
        </h1>
      </header>
      <main>
        {!send && (
          <div className={"togglePositioner"}>
            <div className={"toggleCompareTypeWrapper"}>
              <span
                onClick={() => setToggle((prev) => !prev)}
                className={"toggleCompareTypeSpan"}
              >
                years
              </span>
              <input
                checked={toggle}
                type="checkbox"
                id={"toggleCompareType"}
                className={"toggleCompareTypeInput"}
                onChange={(e) => setToggle(e.target.checked)}
              />
              <label
                htmlFor={"toggleCompareType"}
                className={"toggleCompareTypeLabel"}
              ></label>
              <span
                onClick={() => setToggle((prev) => !prev)}
                className={"toggleCompareTypeSpan"}
              >
                months
              </span>
            </div>
          </div>
        )}

        {toggle ? (
          <>
            <AnimatePresence>
              {!send && (
                <MonthPicker
                  secondMonth={secondMonth}
                  setSecondMonth={setSecondMonth}
                  send={send}
                  comparePickerAnimations={comparePickerAnimations}
                  firstMonth={firstMonth}
                  setFirstMonth={setFirstMonth}
                  handleMonthSend={handleMonthSend}
                  firstYear={firstYear}
                  setFirstYear={setFirstYear}
                  secondYear={secondYear}
                  setSecondYear={setSecondYear}
                />
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            <AnimatePresence>
              {!send && (
                <YearPicker
                  send={send}
                  comparePickerAnimations={comparePickerAnimations}
                  handleYearsSend={handleYearsSend}
                  firstNYear={firstNYear}
                  secondNYear={secondNYear}
                  setFirstNYear={setFirstNYear}
                  setSecondNYear={setSecondNYear}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
};

export default ComparePage;
