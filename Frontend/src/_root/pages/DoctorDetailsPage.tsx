import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetDoctorDetails } from "@/lib/react-query/queriesAndMutations";
import { Modal } from "../../components/ui/Modal";
import { createAppointment, getCurrentUser } from "@/lib/api";

const DoctorDetailsPage = () => {
  const { state } = useLocation();
  const { report } = state || { report: { symptoms: [], diagnosis: "" } }; // Default values
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor, isLoading, error } = useGetDoctorDetails(doctorId);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading doctor details. Please try again later.</div>;
  if (!doctor) return <div>Doctor not found.</div>;

  const handleMakeAppointment = async () => {
    if (!selectedDate) return alert("Please select a date.");

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        alert("User not logged in.");
        return;
      }

      await createAppointment({
        patientId: currentUser.$id,
        doctorId: doctor.$id,
        date: selectedDate,
        report, // Use the report from state
      });

      alert("Appointment successfully created!");
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{doctor.name}</h1>
      <img src={doctor.imageUrl} alt={doctor.name} className="w-32 h-32 mt-4" />
      <p className="mt-4">Specialization: {doctor.specialization}</p>
      <p className="mt-2">Contact: {doctor.phone}</p>
      <p className="mt-2">Email: {doctor.email}</p>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Make Appointment
      </button>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2>Select an Available Date</h2>
          <ul>
            {doctor.availableDates.map((date: string) => (
              <li key={date}>
                <button
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-2 border ${
                    selectedDate === date ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {new Date(date).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleMakeAppointment}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Confirm Appointment
          </button>
        </Modal>
      )}
    </div>
  );
};

export default DoctorDetailsPage;
