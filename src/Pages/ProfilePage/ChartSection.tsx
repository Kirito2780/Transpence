import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.ts";
import { motion } from "framer-motion";
import { API_URL } from "../../api/api.ts";
import useFetch from "../../Hooks/useFetch.ts";

interface ChartSectionProps {
  date__year: number;
  date__month: number;
  total_income: number;
  total_expense: number;
  diff: number;
  diff_absolute: number;
  diff_percent: number;
}

interface ChartSectionState {
  modal: boolean;
  changes: boolean;
}

const ChartSection = ({ modal, changes }: ChartSectionState) => {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [propsData, setPropsData] = useState<ChartSectionProps[]>([]);
  const getChartData = useFetch<ChartSectionProps[]>(
    "get",
    `${API_URL}/auth/users/get_usergraph/`,
    { headers: { Authorization: `Token ${token}` } },
  );
  useEffect(() => {
    const getChartDataFetch = async () => {
      const chartResponse = await getChartData.fetchData();
      if (chartResponse) {
        setPropsData(chartResponse.data);
      }
    };
    void getChartDataFetch();
  }, [modal, changes]);

  return (
    <motion.section
      className={"SpendingSection"}
      initial={{ y: "600px" }}
      animate={{ y: 0 }}
      transition={{
        delay: 0.2,
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      <div className={"SpendingSectionBackground"}>
        <h2 style={{ color: "white" }}>Spending Dynamic(current year)</h2>
        {propsData.length > 0 ? (
          <>
            <Stack direction="row" sx={{ width: "100%" }}>
              <Box sx={{ flexGrow: 1 }}>
                <SparkLineChart
                  data={propsData.map((el) => el.diff)}
                  xAxis={{
                    scaleType: "time",
                    data: propsData.map(
                      (el) => new Date(el.date__year, el.date__month - 1, 1),
                    ),
                    valueFormatter: (value) => value.toISOString().slice(0, 10),
                  }}
                  height={100}
                  showTooltip
                  showHighlight
                />
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <h2>No data</h2>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default ChartSection;
