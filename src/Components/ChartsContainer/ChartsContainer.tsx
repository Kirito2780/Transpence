import React from "react";
import CustomPieChart from "./PieChart/PieChart.tsx";
import TagsPieChart from "./TagsPieChart/TagsPieChart.tsx";
import CustomBarChart from "./CustomBarChart/CustomBarChart";
import Colors from "../Colors/Colors";

interface ChartsContainerProps {
  chartData: any[];
  barChartData: any[];
  tagsDiagram: any[];
  checked: boolean;
  changeDiagram: boolean;
}

const ChartsContainer = ({
  chartData,
  barChartData,
  tagsDiagram,
  checked,
  changeDiagram,
}: ChartsContainerProps) => {
  if (!chartData.length || !barChartData.length) {
    return <h2 className="NoData">No available data to Show</h2>;
  }

  if (!checked) {
    return !changeDiagram ? (
      <CustomPieChart data={chartData} color={Colors.colorForFirstChart} />
    ) : (
      <TagsPieChart data={tagsDiagram} color={Colors.colorForSecondtChart} />
    );
  }

  return (
    <CustomBarChart data={barChartData} colors={Colors.colorForBarChart} />
  );
};

export default React.memo(ChartsContainer);
