import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { motion } from "framer-motion";

type Category = {
  amount: number;
  tag: string;
};
type Month = {
  month: number;
  total: number;
  year: number;
};

interface StatsSectionProps {
  added_files: number;
  biggest_spending_month: Month;
  expenses: number;
  incomes: number;
  most_valuable_category: Category;
}

interface StatsSectionPropsChanger {
  modal: boolean;
  changes: boolean;
}

const StatsSection = ({ modal, changes }: StatsSectionPropsChanger) => {
  const [data, setData] = useState<StatsSectionProps>();
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );

  useEffect(() => {
    if (!token) return;

    const statsData = async () => {
      try {
        const axiosData = await axios.get(
          "http://172.30.88.250:8000/auth/users/stats/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );
        const readyData: StatsSectionProps = axiosData.data;
        setData(readyData);
      } catch (error) {
        console.log(error);
      }
    };
    statsData();
  }, [token, changes, modal]);

  return (
    <motion.section
      className={"ProfileSection"}
      initial={{ y: "600px" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
      <div className={"ProfileStats"}>
        <h2 className={"ProfileStatsHeader"}>Stats</h2>
        <div className={"ProfileStatsItems"}>
          <div className={"ProfileStatsItem"}>
            <span>Added files:</span>
            {data?.added_files}
          </div>

          <div className={"ProfileStatsItem"}>
            <span>Incomes:</span>
            <div>
              {data?.incomes}

              <span>{currency}</span>
            </div>
          </div>

          <div className={"ProfileStatsItem"}>
            <span>Expenses:</span>
            <div>
              {data?.expenses}

              <span>{currency}</span>
            </div>
          </div>

          <div className={"ProfileStatsBigItem"}>
            <div className={"ProfileStatsItemDiv"}>
              <span>Most valuable category:</span>
              {data?.most_valuable_category.tag}
            </div>
            <div className={"ProfileStatsItemDiv"}>
              <span>Value of category:</span>
              <div>
                {data?.most_valuable_category.amount}
                <span>{currency}</span>
              </div>
            </div>
          </div>

          <div className={"ProfileStatsItem"}>
            <span>Biggest Spending month:</span>
            <br />
            <span>
              {data?.biggest_spending_month.month}
              {data?.biggest_spending_month.year}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;
