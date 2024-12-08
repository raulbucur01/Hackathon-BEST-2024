import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsForUser, getCurrentUser } from "@/lib/api";
import {Modal} from "@/components/ui/Modal"; // Assuming a Modal component exists

type Appointment = {
  $id: string;
  doctor: { name: string; specialization: string };
  patient: { name: string; email: string };
  date: string;
  report?: string; // Optional report field
};

const AppointmentsPage = () => {
    const [isDoctor, setIsDoctor] = useState(false); // Determines if the user is a doctor
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
  
    // Fetch appointments based on user type
    const {
      data: appointments,
      isLoading,
      error,
    } = useQuery<Appointment[]>({
      queryKey: ["userAppointments"],
      queryFn: async () => {
        const currentUser = await getCurrentUser();
  
        if (!currentUser) throw new Error("User not logged in.");
  
        // Determine if the user is a doctor or a patient
        const userIsDoctor = !!currentUser.specialization;
        setIsDoctor(userIsDoctor);
  
        // Use the updated `getAppointmentsForUser` method
        return getAppointmentsForUser(currentUser.$id, userIsDoctor);
      },
    });
  
    const handleJoinClick = (appointment: Appointment) => {
      console.log(`Joining meeting for appointment ID: ${appointment.$id}`);
      // Implement join functionality here
    };
  
    const handleViewReport = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setModalOpen(true);
    };
  
    if (isLoading) return <div>Loading...</div>;
    if (error)
      return <div>Error loading appointments. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-dm-dark text-dm-light p-6">
      <h1 className="text-4xl font-semibold text-center mb-6 text-dm-light">
        My Appointments
      </h1>
      <ul className="space-y-4">
        {appointments?.map((appointment) => {
          const isJoinEnabled = new Date() >= new Date(appointment.date);
          return (
            <li
              key={appointment.$id}
              className="bg-dm-dark-2 hover:bg-dm-secondary p-4 rounded-lg shadow-lg transition-colors"
            >
              <div className="flex justify-between items-center space-x-4">
                <div className="flex flex-col">
                  <p className="text-xl font-semibold text-dm-light">
                    Doctor: {appointment.doctor.name}
                  </p>
                  <p className="text-sm text-dm-accent">
                    Specialization: {appointment.doctor.specialization}
                  </p>
                </div>
                <p className="text-sm text-dm-accent text-right">
                  {new Date(appointment.date).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleJoinClick(appointment)}
                  disabled={!isJoinEnabled}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    isJoinEnabled
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Join
                </button>

                {isDoctor && (
                  <button
                    onClick={() => handleViewReport(appointment)}
                    className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  >
                    View Report
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal for viewing the report */}
      {isModalOpen && selectedAppointment && (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-dm-light">
              Appointment Report
            </h2>
            <p className="mb-2">
              <strong>Patient Name:</strong> {selectedAppointment.patient.name}
            </p>
            <p className="mb-2">
              <strong>Patient Email:</strong> {selectedAppointment.patient.email}
            </p>
            <p className="mb-4">
              <strong>Report:</strong> {selectedAppointment.report || "No report available"}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentsPage;
