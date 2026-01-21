import { NavLink } from "react-router-dom";
import "./ComparePage.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { MonthPicker } from "./MonthPicker.tsx";
import { YearPicker } from "./YearPicker";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

interface MonthsStats {
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
interface YearsStats {
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

export const ComparePage = () => {
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
  const [monthData, setMonthData] = useState<MonthsStats | null>();
  const [yearData, setYearData] = useState<YearsStats | null>();
  const [send, setSend] = useState<boolean>(false);

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
            setMonthData(fetch.data.result);
            console.log(fetch.data.result);
          } else if ("first_year_stats" in fetch.data.result) {
            setYearData(fetch.data.result);
          }
          return;
        }

        setTimeout(monthRequest, 5000);
      };
      monthRequest();

      return () => {
        stopped = true;
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
  return (
    <div>
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
            <AnimatePresence>
              {send && monthData && (
                <div>
                  <motion.section
                    className={"MonthsAppearance"}
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    animate={"animate"}
                    transition={{
                      duration: 0.3,
                      delay: 0.5,
                    }}
                  >
                    <div className={"MonthsAppearanceItem"}>
                      <h1>{firstMonthName}</h1>
                      <div className={"MonthsAppearanceItemBlock"}>
                        <div className={"MonthsAppearanceItemBlockWrapper"}>
                          <div>
                            <h2>Year</h2>
                            <h3 className={"MonthsAppearanceItemTextBlock"}>
                              {firstYear}
                            </h3>
                          </div>
                          <div>
                            <h2>Month</h2>
                            <h3 className={"MonthsAppearanceItemTextBlock"}>
                              {firstMonth}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"MonthsAppearanceItem"}>
                      <h1>{secondMonthName}</h1>
                      <div className={"MonthsAppearanceItemBlockWrapper"}>
                        <div>
                          <h2>Year</h2>
                          <h3 className={"MonthsAppearanceItemTextBlock"}>
                            {secondYear}
                          </h3>
                        </div>
                        <div>
                          <h2>Month</h2>
                          <h3 className={"MonthsAppearanceItemTextBlock"}>
                            {secondMonth}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                  <motion.section
                    className={"MonthsComparison"}
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    animate={"animate"}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <div className={"MonthsComparisonItem"}>
                      <h2>Top Tag</h2>
                      <div className={"MonthsComparisonItemContentWrapper"}>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {firstMonthName}
                          </h3>
                          <h4>{monthData.first_month_stats.top_tag}</h4>
                        </div>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {secondMonthName}
                          </h3>
                          <h4>{monthData.second_month_stats.top_tag}</h4>
                        </div>
                      </div>
                    </div>
                    <div className={"MonthsComparisonItem"}>
                      <h2>Incomes</h2>
                      <div className={"MonthsComparisonItemContentWrapper"}>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {firstMonthName}
                          </h3>
                          <h4 className={"MonthsComparisonItemIncomes"}>
                            {monthData.first_month_stats.total_incomes}
                          </h4>
                        </div>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {secondMonthName}
                          </h3>
                          <h4 className={"MonthsComparisonItemIncomes"}>
                            {monthData.second_month_stats.total_incomes}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className={"MonthsComparisonItem"}>
                      <h2>Expenses</h2>
                      <div className={"MonthsComparisonItemContentWrapper"}>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {firstMonthName}
                          </h3>
                          <h4 className={"MonthsComparisonItemExpenses"}>
                            {monthData.first_month_stats.total_expenses}
                          </h4>
                        </div>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {secondMonthName}
                          </h3>
                          <h4 className={"MonthsComparisonItemExpenses"}>
                            {monthData.second_month_stats.total_expenses}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className={"MonthsComparisonItem"}>
                      <h2>Month Profit</h2>
                      <div className={"MonthsComparisonItemContentWrapper"}>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {firstMonthName}
                          </h3>
                          <h4>
                            {monthData.first_month_stats.net_month_profit}
                          </h4>
                        </div>
                        <div>
                          <h3 className={"MonthsComparisonItemHeader"}>
                            {secondMonthName}
                          </h3>
                          <h4>
                            {monthData.second_month_stats.net_month_profit}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                  <motion.div
                    className={"MonthsBarChartSection"}
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    whileInView={"animate"}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={"MonthsBarChartSectionFirstBar"}>
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <BarChart
                          slotProps={{
                            legend: {
                              sx: {
                                color: "white",
                              },
                            },
                          }}
                          xAxis={[
                            {
                              scaleType: "band",
                              data: ["Incomes", "Expenses"],
                              tickLabelStyle: { fill: "white" },
                              position: "bottom",
                              height: 28,
                            },
                          ]}
                          series={[
                            {
                              label: firstMonthName,
                              data: [
                                monthData.first_month_stats.total_incomes,
                                monthData.first_month_stats.total_expenses,
                              ],
                              color: "#8884d8",
                            },
                            {
                              label: secondMonthName,
                              data: [
                                monthData.second_month_stats.total_incomes,
                                monthData.second_month_stats.total_expenses,
                              ],
                              color: "#82ca9d",
                            },
                          ]}
                          yAxis={[
                            {
                              id: "leftAxisId",
                              width: 50,
                              tickLabelStyle: { fill: "white" },
                            },
                            {
                              id: "rightAxisId",
                              position: "right",
                              tickLabelStyle: { fill: "white" },
                            },
                          ]}
                        ></BarChart>
                      </Box>
                    </div>
                    <div className={"MonthsBarChartSectionSecondBar"}>
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <BarChart
                          slotProps={{
                            legend: {
                              sx: {
                                color: "white",
                              },
                            },
                          }}
                          xAxis={[
                            {
                              scaleType: "band",
                              data: [
                                "Average incomes",
                                "Average expenses",
                                "Average savings",
                              ],
                              tickLabelStyle: { fill: "white" },
                              position: "bottom",
                              height: 28,
                            },
                          ]}
                          series={[
                            {
                              label: firstMonthName,
                              data: [
                                monthData.first_avg_month_stats.avg_day_incomes,
                                monthData.first_avg_month_stats
                                  .avg_day_expenses,
                                monthData.first_avg_month_stats
                                  .avg_monthly_saving,
                              ],
                              color: "#8884d8",
                            },
                            {
                              label: secondMonthName,
                              data: [
                                monthData.second_avg_month_stats
                                  .avg_day_incomes,
                                monthData.second_avg_month_stats
                                  .avg_day_expenses,
                                monthData.second_avg_month_stats
                                  .avg_monthly_saving,
                              ],
                              color: "#82ca9d",
                            },
                          ]}
                          yAxis={[
                            {
                              id: "leftAxisId",
                              width: 50,
                              tickLabelStyle: { fill: "white" },
                            },
                            {
                              id: "rightAxisId",
                              position: "right",
                              tickLabelStyle: { fill: "white" },
                            },
                          ]}
                        ></BarChart>
                      </Box>
                    </div>
                  </motion.div>
                  <motion.div
                    className={"MonthPieChartSection"}
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    whileInView={"animate"}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={"MonthsPieChart"}>
                      <h2>Standard Deviation</h2>
                      <PieChart
                        series={[
                          {
                            data: [
                              {
                                label: firstMonthName,
                                value:
                                  monthData.first_avg_month_stats.avg_stddev,
                                color: "#8884d8",
                              },
                              {
                                label: secondMonthName,
                                value:
                                  monthData.second_avg_month_stats.avg_stddev,
                                color: "#82ca9d",
                              },
                            ],
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                            faded: {
                              innerRadius: 30,
                              additionalRadius: -30,
                              color: "gray",
                            },
                          },
                        ]}
                        height={550}
                        width={500}
                      ></PieChart>
                    </div>
                  </motion.div>
                  <motion.div
                    className={"MonthOverallSection"}
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    whileInView={"animate"}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={"CardsWrapper"}>
                      <motion.div
                        className={"PercentChangeCard"}
                        style={{
                          color:
                            monthData.month_comparison.stddev_comparison
                              .percent_change > 0
                              ? "#82ca9d"
                              : "red",
                          border:
                            monthData.month_comparison.stddev_comparison
                              .percent_change > 0
                              ? "1px solid #82ca9d"
                              : "1px solid red",
                        }}
                      >
                        <div>
                          <h2
                            style={{ fontSize: "30px" }}
                            className={"PercentChangeCardHeader"}
                          >
                            {
                              monthData.month_comparison.stddev_comparison
                                .stability_level
                            }
                          </h2>
                          <div className={"PercentChangeCardPercentText"}>
                            <span>
                              {
                                monthData.month_comparison.stddev_comparison
                                  .percent_change
                              }
                            </span>
                            {monthData.month_comparison.stddev_comparison
                              .percent_change > 0 ? (
                              <>
                                <svg
                                  width="80px"
                                  height="80px"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />

                                  <g id="SVGRepo_iconCarrier">
                                    <path
                                      d="M24 6L24 42"
                                      stroke="#8ff0a4"
                                      stroke-width="4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M12 18L24 6L36 18"
                                      stroke="#8ff0a4"
                                      stroke-width="4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </g>
                                </svg>
                              </>
                            ) : (
                              <svg
                                width="80px"
                                height="80px"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                transform="rotate(180)"
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                <g
                                  id="SVGRepo_tracerCarrier"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />

                                <g id="SVGRepo_iconCarrier">
                                  {" "}
                                  <path
                                    d="M24 6L24 42"
                                    stroke="#c01c28"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />{" "}
                                  <path
                                    d="M12 18L24 6L36 18"
                                    stroke="#c01c28"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />{" "}
                                </g>
                              </svg>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
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
