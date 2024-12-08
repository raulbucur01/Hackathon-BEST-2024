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

  if (isLoading) return <div className="text-dm-light">Loading...</div>;
  if (error)
    return (
      <div className="text-dm-accent">
        Error loading doctor details. Please try again later.
      </div>
    );
  if (!doctor) return <div className="text-dm-accent">Doctor not found.</div>;

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
    <div className="flex items-center justify-center min-h-screen bg-dm-dark text-dm-light">
      <div className="p-6 bg-dm-dark-2 rounded-lg shadow-lg max-w-md w-full">
        {/* Doctor Info Section */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-[160px] h-[160px] mt-4 rounded-full border-4 border-dm-secondary"
          />
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold text-dm-light">{doctor.name}</h1>
            <p className="mt-2 text-dm-light">
              Specialization: {doctor.specialization}
            </p>
            <p className="mt-2 text-dm-light">Contact: {doctor.phone}</p>
            <p className="mt-2 text-dm-light">Email: {doctor.email}</p>
          </div>
        </div>

        {/* Make Appointment Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-dm-dark text-dm-light px-6 py-3 rounded-md transition-all duration-200 hover:bg-dm-secondary focus:outline-none"
          >
            Make Appointment
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h2 className="text-xl font-semibold text-dm-light mb-4">
              Select an Available Date
            </h2>
            <ul className="space-y-2">
              {doctor.availableDates.map((date: string) => (
                <li key={date}>
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`w-full text-left px-4 py-2 border border-dm-secondary text-dm-light rounded-md ${
                      selectedDate === date
                        ? "bg-dm-secondary text-dm-light"
                        : "bg-dm-dark text-dm-light"
                    } hover:bg-dm-secondary hover:text-dm-light text-dm-light transition-all duration-200`}
                  >
                    {new Date(date).toLocaleString()}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleMakeAppointment}
              className="mt-4 bg-dm-dark text-dm-light px-6 py-3 rounded-md transition-all duration-200 hover:bg-dm-secondary focus:outline-none"
            >
              Confirm Appointment
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
