import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";

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

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/auth/users/get_usergraph/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPropsData(res.data);
      });
  }, [modal, changes]);

  return (
    <section className={"SpendingSection"}>
      <div className={"SpendingSectionBackground"}>
        <h2 style={{ color: "white" }}>Spending Dynamic</h2>
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
    </section>
  );
};

export default ChartSection;
