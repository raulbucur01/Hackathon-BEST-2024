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
  titleTextStyle: {
    color: "#FFFFFF", // White title text
    fontSize: 18,
  },
  hAxis: {
    title: "Month",
    titleTextStyle: { color: "#FFFFFF" }, // White x-axis title
    textStyle: { color: "#FFFFFF" }, // White x-axis labels
  },
  vAxis: {
    title: "Number of Consultations",
    titleTextStyle: { color: "#FFFFFF" }, // White y-axis title
    textStyle: { color: "#FFFFFF" }, // White y-axis labels
  },
  legend: {
    textStyle: { color: "#FFFFFF" }, // White legend text
    position: "none", // Add "bottom" or "top" if you need the legend
  },
  backgroundColor: "#1E293B", // Matches dark theme
  colors: ["#34D399"], // Accent color for bars
  chartArea: {
    backgroundColor: "#1E293B", // Ensure plot area is dark
    left: "10%",
    right: "10%",
    top: "15%",
    bottom: "15%",
  },
};

function ConsultationChart() {
  return <Chart chartType="ColumnChart" data={consultationData} options={options} width="100%" height="400px" />;
}

export default ConsultationChart;
