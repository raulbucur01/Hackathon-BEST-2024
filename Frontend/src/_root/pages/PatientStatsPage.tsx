import React from "react";
import ConsultationChart from "../charts/ConsultationChart";

function PatientStatsPage() {
  const mockData = {
    totalConsultations: 12,
    favoriteSpecialty: "General Medicine",
    lastConsultation: "2024-12-06",
    frequentSymptoms: ["Headache", "Fatigue", "Cough"],
    mostConsultedDoctor: "Dr. Maria Popescu",
    avgResponseTime: "5 hours",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      {/* Content Wrapper */}
      <div className="w-full max-w-6xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">Your Health Statistics</h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consultation Summary */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Consultation Summary</h2>
            <p className="mb-2">Total Consultations: {mockData.totalConsultations}</p>
            <p className="mb-2">Favorite Specialty: {mockData.favoriteSpecialty}</p>
            <p>Last Consultation: {mockData.lastConsultation}</p>
          </div>

          {/* Frequent Symptoms */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Frequent Symptoms</h2>
            <ul className="list-disc list-inside space-y-2">
              {mockData.frequentSymptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          {/* Consultation Chart */}
          <div className="bg-white p-6 shadow-lg rounded-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Consultations Over Time</h2>
            <ConsultationChart />
          </div>

          {/* Doctor Interactions */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Doctor Interactions</h2>
            <p className="mb-2">Most Consulted Doctor: {mockData.mostConsultedDoctor}</p>
            <p>Average Response Time: {mockData.avgResponseTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientStatsPage;
