import React from "react";
import { useUserContext } from "@/context/AuthContext";
import { mockedStatsData } from "@/lib/statsData";
import { Chart } from "react-google-charts";

const Profile = () => {
  const { user } = useUserContext();

  return (
    <div className="min-h-screen bg-dm-dark py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Information */}
      <div className="max-w-4xl mx-auto bg-dm-dark-2 shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={user.imageUrl}
            alt="Profile Picture"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-semibold text-dm-light">
              {user.name}
            </h1>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-dm-light mb-2">
            Contact Information
          </h2>
          <ul className="text-dm-light">
            <li>Email: {user.email}</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: San Francisco, CA</li>
          </ul>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consultation Trends */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-dm-light">
            Consultations Over Time
          </h3>
          <Chart
            chartType="LineChart"
            data={[
              ["Month", "Symptoms Reported"],
              ...mockedStatsData.symptomTrends.map((trend) => [
                trend.month,
                trend.symptoms,
              ]),
            ]}
            options={{
              title: "",
              curveType: "function",
              legend: { position: "bottom" },
              backgroundColor: "#1E293B",
              colors: ["#34D399"],
            }}
          />
        </div>

        {/* Health Insights */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-dm-light">
            Health Insights
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {mockedStatsData.healthInsights.map((insight, index) => (
              <li key={index} className="text-dm-light">
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Doctor Statistics */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-dm-light">
            Doctor Statistics
          </h3>
          <p className="text-dm-light">
            Most Consulted Doctor:{" "}
            <span className="font-semibold">
              {mockedStatsData.doctorStats.mostConsulted}
            </span>
          </p>
          <p className="text-dm-light">
            Average Response Time:{" "}
            <span className="font-semibold">
              {mockedStatsData.doctorStats.avgResponseTime}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
