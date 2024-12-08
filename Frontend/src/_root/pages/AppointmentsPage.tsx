import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsForUser, getCurrentUser } from "@/lib/api";
import VideoRoom from "./VideoRoom";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/Modal"; // Assuming a Modal component exists
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

type Appointment = {
  $id: string;
  doctor: { name: string; specialization: string } | null; // doctor can be null
  patient: { name: string; email: string };
  date: string;
  report?: string;
};

const AppointmentsPage = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");

  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["userAppointments"],
    queryFn: async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User not logged in.");

      const userIsDoctor = !!currentUser.specialization;
      setIsDoctor(userIsDoctor);

      return getAppointmentsForUser(currentUser.$id, userIsDoctor);
    },
  });

  const navigate = useNavigate();
  const handleJoinClick = async (appointment: Appointment) => {
    try {
      const roomName = `room-${appointment.$id}`;
      console.log(roomName);
      const identity = isDoctor
        ? appointment.patient.name // If doctor, display patient's name
        : appointment.doctor?.name; // If patient, display doctor's name

      const response = await fetch(
        "https://ai-backend-611700556817.us-central1.run.app/generate-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, identity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Twilio token");
      }

      const { token } = await response.json();
      navigate("/video-room", { state: { token, roomName } });
    } catch (error) {
      console.error("Error joining video chat:", error);
    }
  };

  const handleViewReport = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  if (isJoining && token && roomName) {
    return <VideoRoom token={token} roomName={roomName} />;
  }

  if (isLoading)
    return (
      <div className="bg-dm-dark h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return <div>Error loading appointments. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-dm-dark text-dm-light p-6">
      <h1 className="text-4xl font-semibold text-center mb-6 text-dm-light">
        My Appointments
      </h1>
      {appointments?.length === 0 ? (
        <p className="text-center text-dm-light">
          You have no appointments scheduled.
        </p>
      ) : (
        <ul className="space-y-4">
          {appointments?.map((appointment) => {
            if (!appointment.doctor) {
              // Handle the case where doctor is null or undefined
              return (
                <li
                  key={appointment.$id}
                  className="bg-dm-dark-2 p-4 rounded-lg shadow-lg transition-colors"
                >
                  <p className="text-center text-dm-light">
                    Doctor information is missing
                  </p>
                </li>
              );
            }

            const isJoinEnabled = new Date() >= new Date(appointment.date);
            return (
              <li
                key={appointment.$id}
                className="bg-dm-dark hover:bg-dm-dark p-4 rounded-lg shadow-lg transition-colors"
              >
                <div className="flex justify-between items-center space-x-4">
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold text-dm-light">
                      {isDoctor
                        ? `Patient: ${appointment.patient.name}`
                        : `Doctor: ${appointment.doctor.name}`}
                    </p>
                    <p className="text-sm text-dm-accent">
                      {!isDoctor
                        ? `Specialization: ${appointment.doctor?.specialization}`
                        : `Appointment Date: ${new Date(
                            appointment.date
                          ).toLocaleString()}`}
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
                        ? "bg-green-500 hover:bg-green-300 text-white"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Join
                  </button>

                  {isDoctor && (
                    <button
                      onClick={() => handleViewReport(appointment)}
                      className="px-4 py-2 rounded-md bg-dm-dark-2 hover:bg-dm-secondary text-white font-semibold"
                    >
                      View Report
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

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
              <strong>Patient Email:</strong>{" "}
              {selectedAppointment.patient.email}
            </p>
            <p className="mb-4">
              <strong>Report:</strong>{" "}
              {selectedAppointment.report || "No report available"}
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
