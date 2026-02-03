import { domAnimation, LazyMotion, m } from "framer-motion";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { YearStats } from "../ComparePage.tsx";
import "../ComparePage.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Store/Store.tsx";

interface YearPageLocationState {
  yearData: YearStats;
  firstYear: string;
  secondYear: string;
}

export const YearPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );
  const state = location.state as YearPageLocationState | null;
  if (!state) {
    return <Navigate to="/compare" replace />;
  }
  const { yearData, firstYear, secondYear } = state;

  const comparePickerAnimations = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    sent: { opacity: 0, scale: 0 },
  };
  const cardsAnimation = {
    initial: { opacity: 0, y: 300 },
    animate: { opacity: 1, y: 0 },
  };
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <LazyMotion features={domAnimation}>
      <div>
        <m.section
          className={"MonthsAppearance"}
          variants={comparePickerAnimations}
          initial={"initial"}
          animate={"animate"}
          transition={{
            duration: 0.3,
          }}
        >
          <div className={"MonthsAppearanceItem"}>
            <h1>{firstYear}</h1>
          </div>
          <div className={"MonthsAppearanceItem"}>
            <h1>{secondYear}</h1>
          </div>
        </m.section>
        <m.section
          className={"MonthsComparison"}
          variants={comparePickerAnimations}
          initial={"initial"}
          animate={"animate"}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className={"MonthsComparisonItem"}>
            <h2>Top Tag</h2>
            <div className={"MonthsComparisonItemContentWrapper"}>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{firstYear}</h3>
                <h4>{yearData.first_year_stats.top_tag}</h4>
              </div>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{secondYear}</h3>
                <h4>{yearData.second_year_stats.top_tag}</h4>
              </div>
            </div>
          </div>
          <div className={"MonthsComparisonItem"}>
            <h2>Incomes</h2>
            <div className={"MonthsComparisonItemContentWrapper"}>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{firstYear}</h3>
                <h4 className={"MonthsComparisonItemIncomes"}>
                  {yearData.first_year_stats.total_incomes}

                  <span>{currency}</span>
                </h4>
              </div>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{secondYear}</h3>
                <h4 className={"MonthsComparisonItemIncomes"}>
                  {yearData.second_year_stats.total_incomes}

                  <span>{currency}</span>
                </h4>
              </div>
            </div>
          </div>

          <div className={"MonthsComparisonItem"}>
            <h2>Expenses</h2>
            <div className={"MonthsComparisonItemContentWrapper"}>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{firstYear}</h3>
                <h4 className={"MonthsComparisonItemExpenses"}>
                  {yearData.first_year_stats.total_expenses}

                  <span>{currency}</span>
                </h4>
              </div>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{secondYear}</h3>
                <h4 className={"MonthsComparisonItemExpenses"}>
                  {yearData.second_year_stats.total_expenses}

                  <span>{currency}</span>
                </h4>
              </div>
            </div>
          </div>
          <div className={"MonthsComparisonItem"}>
            <h2>Month Profit</h2>
            <div className={"MonthsComparisonItemContentWrapper"}>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{firstYear}</h3>
                <h4>{yearData.first_year_stats.net_profit}</h4>

                <span>{currency}</span>
              </div>
              <div>
                <h3 className={"MonthsComparisonItemHeader"}>{secondYear}</h3>
                <h4>{yearData.second_year_stats.net_profit}</h4>

                <span>{currency}</span>
              </div>
            </div>
          </div>
        </m.section>
        <m.div
          className={"MonthsBarChartSection"}
          variants={comparePickerAnimations}
          initial={"initial"}
          animate={"animate"}
          transition={{ duration: 0.3, delay: 0.4 }}
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
                    label: firstYear,
                    data: [
                      yearData.first_year_stats.total_incomes,
                      yearData.first_year_stats.total_expenses,
                    ],
                    color: "#8884d8",
                  },
                  {
                    label: secondYear,
                    data: [
                      yearData.second_year_stats.total_incomes,
                      yearData.second_year_stats.total_expenses,
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
                    label: firstYear,
                    data: [
                      yearData.first_avg_year_stats.avg_monthly_incomes,
                      yearData.first_avg_year_stats.avg_monthly_expenses,
                      yearData.first_avg_year_stats.avg_monthly_saving,
                    ],
                    color: "#8884d8",
                  },
                  {
                    label: secondYear,
                    data: [
                      yearData.second_avg_year_stats.avg_monthly_incomes,
                      yearData.second_avg_year_stats.avg_monthly_expenses,
                      yearData.second_avg_year_stats.avg_monthly_saving,
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
        </m.div>
        <m.div
          className={"MonthPieChartSection"}
          variants={comparePickerAnimations}
          initial={"initial"}
          whileInView={"animate"}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3 }}
        >
          <div className={"MonthsPieChart"}>
            <h2>Standard Deviation</h2>
            <PieChart
              series={[
                {
                  data: [
                    {
                      label: firstYear,
                      value: yearData.first_avg_year_stats.avg_stddev,
                      color: "#8884d8",
                    },
                    {
                      label: secondYear,
                      value: yearData.second_avg_year_stats.avg_stddev,
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
        </m.div>
        <m.div
          className={"MonthOverallSection"}
          variants={comparePickerAnimations}
          initial={"initial"}
          whileInView={"animate"}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className={"CardsWrapper"}>
            <m.div
              variants={cardsAnimation}
              initial={"initial"}
              whileInView={"animate"}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={"PercentChangeCard"}
              style={{
                color:
                  yearData.year_comparison.stddev_comparison.percent_change > 0
                    ? "#82ca9d"
                    : "red",
                border:
                  yearData.year_comparison.stddev_comparison.percent_change > 0
                    ? "1px solid #82ca9d"
                    : "1px solid red",
              }}
            >
              <div>
                <h2
                  style={{ fontSize: "29px" }}
                  className={"PercentChangeCardHeader"}
                >
                  {yearData.year_comparison.stddev_comparison.title}
                </h2>
                <div className={"PercentChangeCardPercentText"}>
                  <span>
                    {yearData.year_comparison.stddev_comparison.percent_change}
                  </span>
                  {yearData.year_comparison.stddev_comparison.percent_change >
                  0 ? (
                    <>
                      <svg
                        width="80px"
                        height="80px"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M24 6L24 42"
                            stroke="#8ff0a4"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 18L24 6L36 18"
                            stroke="#8ff0a4"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

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
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                        <path
                          d="M12 18L24 6L36 18"
                          stroke="#c01c28"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  )}
                </div>
              </div>
            </m.div>

            <m.div
              variants={cardsAnimation}
              initial={"initial"}
              whileInView={"animate"}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className={"PercentChangeCard"}
              style={{ border: "1px solid rosybrown" }}
            >
              <m.div>
                <h2
                  style={{ fontSize: "30px", color: "rosybrown" }}
                  className={"PercentChangeCardHeader"}
                >
                  Key actions
                </h2>
                <div className={"PercentChangeCardPercentText"}>
                  <m.ul
                    viewport={{ once: true }}
                    variants={container}
                    initial="hidden"
                    whileInView={"visible"}
                    transition={{ delay: 0.6 }}
                  >
                    {yearData.year_comparison.stddev_comparison.actions.map(
                      (el, index) => (
                        <m.li
                          key={index}
                          variants={item}
                          style={{
                            fontSize: "18px",
                            marginBottom: "10px",
                            color: "rosybrown",
                          }}
                        >
                          {el}
                        </m.li>
                      ),
                    )}
                  </m.ul>
                </div>
              </m.div>
            </m.div>

            <m.div
              variants={cardsAnimation}
              initial={"initial"}
              whileInView={"animate"}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className={"PercentChangeCard"}
              style={{ border: "1px solid #e8e337" }}
            >
              <div>
                <h2
                  style={{ fontSize: "29px", color: "#e8e337" }}
                  className={"PercentChangeCardHeader"}
                >
                  Key message
                </h2>
                <div className={"PercentChangeCardPercentText"}>
                  <m.span
                    variants={comparePickerAnimations}
                    initial={"initial"}
                    whileInView={"animate"}
                    viewport={{ once: true }}
                    style={{ fontSize: "30px", color: "#e8e337" }}
                  >
                    {yearData.year_comparison.stddev_comparison.key_message}
                  </m.span>
                </div>
              </div>
            </m.div>
          </div>
        </m.div>
        <div className={"MonthButtonSection"}>
          <button
            className={"MonthButton"}
            onClick={() => {
              navigate("/");
            }}
          >
            Main
          </button>
          <button
            className={"MonthButton"}
            onClick={() => {
              navigate("/compare");
            }}
          >
            Compare again
          </button>
        </div>
      </div>
    </LazyMotion>
  );
};
