import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDoctorDetails } from "@/lib/react-query/queriesAndMutations";
import { Modal } from "../../components/ui/Modal";
import { createAppointment, getCurrentUser } from "@/lib/api";

const DoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor, isLoading, error } = useGetDoctorDetails(doctorId);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error loading doctor details. Please try again later.</div>;
  if (!doctor) return <div>Doctor not found.</div>;

  const handleMakeAppointment = async () => {
    if (!selectedDate) return alert("Please select a date.");
  
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        alert("User not logged in.");
        return;
      }
  
      // Prepare the report based on the health assistant data
      const report = {
        symptoms: JSON.parse(localStorage.getItem("responseData") || "{}").symptoms || [],
        diagnosis: JSON.parse(localStorage.getItem("responseData") || "{}").diagnosis || "",
      };
  
      await createAppointment({
        patientId: currentUser.$id,
        doctorId: doctor.$id,
        date: selectedDate,
        report,
      });
  
      alert("Appointment successfully created and report sent to doctor!");
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating appointment or sending report:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        {/* Doctor's Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-40 h-40 rounded-full border-4 border-blue-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{doctor.name}</h1>
            <p className="mt-2 text-lg text-gray-600">
              <span className="font-semibold text-gray-700">Specialization: </span>
              {doctor.specialization}
            </p>
            <p className="mt-2 text-gray-600">
              <span className="font-semibold text-gray-700">Contact: </span>
              {doctor.phone}
            </p>
            <p className="mt-2 text-gray-600">
              <span className="font-semibold text-gray-700">Email: </span>
              {doctor.email}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition"
            >
              Make Appointment
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h2 className="text-2xl font-bold text-blue-700">Select an Available Date</h2>
            <ul className="mt-4 space-y-2">
              {doctor.availableDates.map((date: string) => (
                <li key={date}>
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm ${
                      selectedDate === date
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-100"
                    } transition`}
                  >
                    {new Date(date).toLocaleString()}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleMakeAppointment}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
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
