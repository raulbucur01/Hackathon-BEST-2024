import React from "react";
import ConsultationChart from "../charts/ConsultationChart";

const PatientStatsPage = () => {
  const mockData = {
    totalConsultations: 12,
    favoriteSpecialty: "General Medicine",
    lastConsultation: "2024-12-06",
    frequentSymptoms: ["Headache", "Fatigue", "Cough"],
    mostConsultedDoctor: "Dr. Maria Popescu",
    avgResponseTime: "5 hours",
  };

  return (
    <div className="min-h-screen bg-dm-dark text-dm-light p-6">
      <h1 className="text-4xl font-semibold text-center mb-6">Your Health Statistics</h1>

      <div className="space-y-6">
        {/* Consultation Summary */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Consultation Summary</h2>
          <p>Total Consultations: {mockData.totalConsultations}</p>
          <p>Favorite Specialty: {mockData.favoriteSpecialty}</p>
          <p>Last Consultation: {mockData.lastConsultation}</p>
        </div>

        {/* Frequent Symptoms */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Frequent Symptoms</h2>
          <ul className="list-disc list-inside space-y-2">
            {mockData.frequentSymptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>

        {/* Consultations Over Time */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Consultations Over Time</h2>
          <ConsultationChart />
        </div>

        {/* Doctor Interactions */}
        <div className="bg-dm-dark-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Doctor Interactions</h2>
          <p>Most Consulted Doctor: {mockData.mostConsultedDoctor}</p>
          <p>Average Response Time: {mockData.avgResponseTime}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientStatsPage;
