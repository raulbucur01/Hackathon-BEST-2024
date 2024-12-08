import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsForUser, getCurrentUser } from "@/lib/api";
import { useUserContext } from "@/context/AuthContext";

type Appointment = {
  $id: string;
  doctor: { name: string; specialization: string };
  date: string;
};

const AppointmentsPage = () => {
  const { user } = useUserContext();
  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["userAppointments"],
    queryFn: async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User not logged in.");
      return getAppointmentsForUser(currentUser.$id);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error loading appointments. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-dm-dark text-dm-light p-6">
      <h1 className="text-4xl font-semibold text-center mb-6 text-dm-light">
        My Appointments
      </h1>
      <ul className="space-y-4">
        {appointments?.map((appointment) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsPage;
