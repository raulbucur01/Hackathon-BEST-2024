import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsForUser, getCurrentUser } from "@/lib/api";

type Appointment = {
  $id: string;
  doctor: { name: string; specialization: string };
  date: string;
};

const AppointmentsPage = () => {
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["userAppointments"],
    queryFn: async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User not logged in.");
      return getAppointmentsForUser(currentUser.$id);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading appointments. Please try again later.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">My Appointments</h1>
      <ul className="mt-4">
        {appointments?.map((appointment) => (
          <li key={appointment.$id} className="border-b py-2">
            <p>Doctor: {appointment.doctor.name}</p>
            <p>Specialization: {appointment.doctor.specialization}</p>
            <p>Date: {new Date(appointment.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsPage;
