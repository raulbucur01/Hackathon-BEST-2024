import React from "react";
import { Chart } from "react-google-charts";

const consultationData = [
  ["Month", "Consultations"],
  ["January", 2],
  ["February", 1],
  ["March", 3],
  ["April", 1],
  ["May", 2],
  ["June", 3],
];

const options = {
  title: "Consultations Over Time",
  hAxis: { title: "Month" },
  vAxis: { title: "Number of Consultations" },
  legend: "none",
};

function ConsultationChart() {
  return <Chart chartType="ColumnChart" data={consultationData} options={options} />;
}

export default ConsultationChart;
